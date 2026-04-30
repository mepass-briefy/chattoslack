import crypto from "crypto";
import { kvGet, kvSet, kvScan } from "./db.js";

/* ── 환경변수 접근자 ─────────────────────────────────────────── */
const BOT_TOKEN   = () => process.env.SLACK_BOT_TOKEN;
const SIGN_SECRET = () => process.env.SLACK_SIGNING_SECRET;
const ROBIN_UID   = () => process.env.SLACK_ROBIN_USER_ID;   // 로빈의 Slack User ID
const CHANNEL_ID  = () => process.env.SLACK_CHANNEL_ID;      // 기본 채널 ID

/* ── Slack 서명 검증 ─────────────────────────────────────────── */
function verifySlack(rawBody, headers) {
  const secret = SIGN_SECRET();
  if (!secret) return true; // 개발 초기: 미설정이면 통과

  const ts  = headers["x-slack-request-timestamp"];
  const sig = headers["x-slack-signature"];
  if (!ts || !sig) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false; // 리플레이 방지

  const hmac = "v0=" + crypto
    .createHmac("sha256", secret)
    .update(`v0:${ts}:${rawBody}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(sig));
  } catch {
    return false;
  }
}

/* ── 가능한 슬롯 계산 ─────────────────────────────────────────  */
const WORK_HOURS = [9, 10, 11, 13, 14, 15, 16, 17, 18, 19]; // 12시 점심 제외

function getAvailableSlots(schedules) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const nowH  = new Date().getHours();

  // CRM에서 명시적으로 슬랙 가능 일정으로 등록된 슬롯만 반환
  const slackSlots = schedules.filter(s => s.slackAvailable);
  const byDate = {};
  for (const s of slackSlots) {
    const h = parseInt(s.start);
    if (!byDate[s.date]) byDate[s.date] = [];
    byDate[s.date].push(h);
  }
  return Object.keys(byDate).sort().map(date => ({ date, hours: byDate[date].sort((a,b)=>a-b) }));
}

/* ── 날짜 포맷 ───────────────────────────────────────────────── */
function fmtDay(dateStr) {
  const d  = new Date(dateStr + "T00:00:00");
  const KO = ["일","월","화","수","목","금","토"];
  return `${d.getMonth() + 1}/${d.getDate()}(${KO[d.getDay()]})`;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ── Block Kit 메시지 빌더 ───────────────────────────────────── */
function buildBlocks(slots) {
  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: "📅 로빈과 미팅 예약", emoji: true }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "원하는 시간을 선택하면 즉시 예약이 확정됩니다."
      }
    },
    { type: "divider" }
  ];

  for (const day of slots) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*${fmtDay(day.date)}*` }
    });

    // Slack actions 블록은 최대 5개 elements
    for (let i = 0; i < day.hours.length; i += 5) {
      blocks.push({
        type: "actions",
        elements: day.hours.slice(i, i + 5).map(h => ({
          type: "button",
          text: { type: "plain_text", text: `${h}:00 – ${h + 1}:00`, emoji: false },
          value: JSON.stringify({ date: day.date, hour: h }),
          action_id: `slot__${day.date}__${h}`,
          style: "primary"
        }))
      });
    }
  }

  blocks.push({ type: "divider" });
  blocks.push({
    type: "context",
    elements: [{
      type: "mrkdwn",
      text: "버튼 클릭 후 로빈에게 DM으로 확정 알림이 전송됩니다."
    }]
  });

  return blocks;
}

function confirmedBlocks(booker, date, hour) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: [
          `✅ *미팅 예약이 확정되었습니다!*`,
          `> 예약자: *${booker.real_name || booker.name}*`,
          `> 일시:　　*${fmtDay(date)} ${hour}:00 – ${hour + 1}:00*`,
          ``,
          `로빈에게 DM으로 알림을 전송했습니다.`
        ].join("\n")
      }
    }
  ];
}

/* ── Slack API 헬퍼 ──────────────────────────────────────────── */
async function slackAPI(method, body) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Bearer ${BOT_TOKEN()}`
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function dmRobin(text, blocks) {
  const robinId = ROBIN_UID();
  if (!robinId) { console.log("[DM] ROBIN_USER_ID 미설정"); return; }
  console.log("[DM] conversations.open →", robinId);
  const open = await slackAPI("conversations.open", { users: robinId });
  console.log("[DM] open result:", JSON.stringify(open));
  if (!open.ok) return;
  const result = await slackAPI("chat.postMessage", {
    channel: open.channel.id,
    text,
    ...(blocks ? { blocks } : {})
  });
  console.log("[DM] postMessage result:", result.ok, result.error || "");
}

/* ── Raw body 미들웨어 ───────────────────────────────────────── */
function rawBody(req, res, next) {
  let data = "";
  req.on("data", c => { data += c; });
  req.on("end",  () => { req.rawBody = data; next(); });
}

function parseUrlEncoded(req, _res, next) {
  const params = new URLSearchParams(req.rawBody || "");
  req.body = Object.fromEntries(params);
  next();
}

/* ── 라우터 설정 ─────────────────────────────────────────────── */
export function setupSlack(app) {

  /* ① /robting 슬래시 커맨드 */
  app.post("/slack/commands", rawBody, parseUrlEncoded, async (req, res) => {
    if (!verifySlack(req.rawBody, req.headers))
      return res.status(401).send("Unauthorized");

    const { command, channel_id, response_url } = req.body;
    if (command !== "/robting") return res.status(400).send("Unknown command");

    // Slack 3초 타임아웃 전에 즉시 응답
    res.json({ response_type: "ephemeral", text: "⏳ 미팅 가능 시간을 조회 중입니다..." });

    // 비동기로 가능 슬롯 조회 후 채널에 게시
    const schedules   = kvGet("schedule:local") || [];
    const slots       = getAvailableSlots(schedules);

    const payload = slots.length === 0
      ? { response_type: "in_channel", text: "현재 예약 가능한 미팅 시간이 없습니다." }
      : { response_type: "in_channel", text: "로빈의 미팅 가능 시간", blocks: buildBlocks(slots) };

    await fetch(response_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  });

  /* ② 버튼 클릭 인터랙션 */
  app.post("/slack/interactions", rawBody, parseUrlEncoded, async (req, res) => {
    if (!verifySlack(req.rawBody, req.headers))
      return res.status(401).send("Unauthorized");

    let payload;
    try { payload = JSON.parse(req.body.payload); }
    catch { return res.sendStatus(400); }

    console.log("[Interaction] type:", payload.type);
    if (payload.type !== "block_actions") return res.sendStatus(200);

    const action = payload.actions?.[0];
    if (!action?.value) return res.sendStatus(200);

    let slotData;
    try { slotData = JSON.parse(action.value); }
    catch { return res.sendStatus(200); }

    const { date, hour } = slotData;
    const booker = payload.user;

    // 중복 요청 체크
    const requests = kvGet("slackRequests") || [];
    if (requests.some(r => r.date === date && r.hour === hour && r.requesterId === booker.id)) {
      return res.json({ replace_original: false, text: "⚠️ 이미 요청하신 시간입니다." });
    }

    // users.info로 실제 이름/프로필 조회
    let requesterName = booker.name;
    let requesterEmail = "";
    let requesterTitle = "";
    try {
      const info = await slackAPI("users.info", { user: booker.id });
      if (info.ok && info.user?.profile) {
        const p = info.user.profile;
        requesterName = p.real_name || p.display_name || booker.name;
        requesterEmail = p.email || "";
        requesterTitle = p.title || "";
      }
    } catch {}

    // 요청 저장
    const request = {
      id: uid(), date, hour,
      requesterId: booker.id,
      requesterName,
      requesterUsername: booker.name,
      requesterEmail,
      requesterTitle,
      requestedAt: new Date().toISOString()
    };
    kvSet("slackRequests", [...requests, request]);

    // 로빈에게 새 요청 DM 알림
    await dmRobin(
      `📬 새 미팅 요청: ${fmtDay(date)} ${hour}:00–${hour + 1}:00 / ${request.requesterName}`,
      [{
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `📬 *새 미팅 요청이 들어왔습니다*`,
            `> 요청자: *${request.requesterName}* (@${request.requesterUsername})`,
            `> 일시:　　*${fmtDay(date)} ${hour}:00 – ${hour + 1}:00*`,
            `CRM에서 확인 후 확정해 주세요.`
          ].join("\n")
        }
      }, {
        type: "actions",
        elements: [{ type: "button", text: { type: "plain_text", text: "CRM에서 확인하기", emoji: true }, url: "http://localhost:4321", action_id: "open_crm" }]
      }]
    );

    // 요청자에게 ephemeral 응답
    res.json({
      replace_original: false,
      text: `✅ 요청되었습니다! *${fmtDay(date)} ${hour}:00 – ${hour + 1}:00* 미팅을 요청했습니다. Robin이 확인 후 확정 연락 드립니다.`
    });
  });

}

/* ── DM 헬퍼 ─────────────────────────────────────────────────── */
async function sendDM(userId, text, blocks) {
  const open = await slackAPI("conversations.open", { users: userId });
  if (!open.ok) return { ok: false, error: open.error };
  return slackAPI("chat.postMessage", { channel: open.channel.id, text, ...(blocks ? { blocks } : {}) });
}

/* ── CRM 프론트엔드 API (express.json 이후 등록) ──────────────── */
export function setupSlackSend(app) {

  /* 요청 목록 조회 */
  app.get("/api/slack/requests", (req, res) => {
    const all = kvGet("slackRequests") || [];
    const { date, hour } = req.query;
    if (date && hour !== undefined) {
      return res.json({ requests: all.filter(r => r.date === date && r.hour === parseInt(hour)) });
    }
    res.json({ requests: all });
  });

  /* 요청 확정 */
  app.post("/api/slack/confirm", async (req, res) => {
    const { requestId, scheduleKey } = req.body;
    const all = kvGet("slackRequests") || [];
    const req_ = all.find(r => r.id === requestId);
    if (!req_) return res.status(404).json({ error: "요청을 찾을 수 없습니다." });

    const { date, hour, requesterId, requesterName, requesterUsername } = req_;

    // slackAvailable 슬롯 → 확정 예약으로 교체
    const allScheds = kvScan("schedule:");
    let targetKey = scheduleKey || "schedule:local";
    let schedules = [];
    for (const { key, value } of allScheds) {
      if (!Array.isArray(value)) continue;
      if (value.some(s => s.date === date && parseInt(s.start) === hour && s.slackAvailable)) {
        targetKey = key; schedules = value; break;
      }
    }
    if (!schedules.length) {
      const first = allScheds.find(({ value }) => Array.isArray(value) && value.length);
      if (first) { targetKey = first.key; schedules = first.value; }
    }

    const entry = {
      id: uid(), date,
      start: `${hour}:00`, end: `${hour + 1}:00`,
      title: `${requesterName}님과 미팅`,
      customer_id: "", note: `Slack 요청 확정 (@${requesterUsername})`
    };
    kvSet(targetKey, [...schedules.filter(s => !(s.date === date && parseInt(s.start) === hour)), entry]);

    // 해당 슬롯 요청 전체 제거
    kvSet("slackRequests", all.filter(r => !(r.date === date && r.hour === hour)));

    // 확정자에게 DM
    if (requesterId && BOT_TOKEN()) {
      await sendDM(requesterId,
        `✅ 미팅이 확정되었습니다! ${fmtDay(date)} ${hour}:00 – ${hour + 1}:00`,
        [{ type: "section", text: { type: "mrkdwn",
          text: `✅ *미팅이 확정되었습니다!*\n> 일시: *${fmtDay(date)} ${hour}:00 – ${hour + 1}:00*\n캘린더에 추가해 주세요.`
        }}]
      );
    }

    res.json({ ok: true });
  });
  app.post("/api/slack/send-availability", async (req, res) => {
    if (!BOT_TOKEN())
      return res.status(500).json({ error: "SLACK_BOT_TOKEN이 설정되지 않았습니다." });

    const scheduleKey = req.body?.scheduleKey || "schedule:local";
    const schedules   = kvGet(scheduleKey) || [];
    const slots       = getAvailableSlots(schedules);

    if (!slots.length)
      return res.json({ ok: false, message: "예약 가능한 시간이 없습니다." });

    const text   = "로빈의 미팅 가능 시간";
    const blocks = buildBlocks(slots);
    const dmUserIds = (req.body?.dmUserIds || []).filter(Boolean); // ["U123", "U456"]
    const results = [];

    // 채널/스레드 전송
    const channelId = req.body?.channelId || CHANNEL_ID();
    if (channelId) {
      const msg = { channel: channelId, text, blocks };
      if (req.body?.threadTs) msg.thread_ts = req.body.threadTs;
      const r = await slackAPI("chat.postMessage", msg);
      results.push({ type: "channel", ok: r.ok, error: r.error });
    }

    // DM 전송
    for (const uid of dmUserIds) {
      const r = await sendDM(uid, text, blocks);
      results.push({ type: "dm", uid, ok: r.ok, error: r.error });
    }

    if (!channelId && dmUserIds.length === 0)
      return res.status(500).json({ error: "SLACK_CHANNEL_ID가 설정되지 않았습니다." });

    const failed = results.filter(r => !r.ok);
    if (failed.length === results.length)
      return res.status(500).json({ error: failed[0]?.error || "전송 실패" });

    res.json({ ok: true, results });
  });
}

