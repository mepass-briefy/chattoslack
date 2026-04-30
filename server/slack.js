import crypto from "crypto";
import { kvGet, kvSet } from "./db.js";

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
const WORK_HOURS = [9, 10, 11, 13, 14, 15, 16]; // 12시 점심 제외

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
  if (!robinId) return;
  const open = await slackAPI("conversations.open", { users: robinId });
  if (!open.ok) return;
  await slackAPI("chat.postMessage", {
    channel: open.channel.id,
    text,
    ...(blocks ? { blocks } : {})
  });
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

    if (payload.type !== "block_actions") return res.sendStatus(200);

    const action = payload.actions?.[0];
    if (!action?.value) return res.sendStatus(200);

    let slotData;
    try { slotData = JSON.parse(action.value); }
    catch { return res.sendStatus(200); }

    const { date, hour } = slotData;
    const booker = payload.user;

    // 중복 예약 체크 (slackAvailable 슬롯 제외)
    const schedules = kvGet("schedule:local") || [];
    const conflict = schedules.find(s => s.date === date && parseInt(s.start) === hour && !s.slackAvailable);
    if (conflict) {
      return res.json({
        response_action: "ephemeral",
        text: "⚠️ 이미 예약된 시간입니다. 다른 시간을 선택해 주세요."
      });
    }

    // slackAvailable 슬롯을 확정 예약으로 교체
    const withoutSlot = schedules.filter(s => !(s.date === date && parseInt(s.start) === hour));
    const entry = {
      id: uid(),
      date,
      start: `${hour}:00`,
      end:   `${hour + 1}:00`,
      title: `${booker.real_name || booker.name}님과 미팅`,
      customer_id: "",
      note: `Slack 예약 (@${booker.name})`
    };
    kvSet("schedule:local", [...withoutSlot, entry]);

    // 로빈에게 DM
    await dmRobin(
      `📅 미팅 확정: ${fmtDay(date)} ${hour}:00–${hour + 1}:00 / ${booker.real_name || booker.name}`,
      [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: [
              `📅 *미팅이 확정되었습니다!*`,
              `> 예약자: *${booker.real_name || booker.name}* (@${booker.name})`,
              `> 일시:　　*${fmtDay(date)} ${hour}:00 – ${hour + 1}:00*`
            ].join("\n")
          }
        },
        {
          type: "actions",
          elements: [{
            type: "button",
            text: { type: "plain_text", text: "CRM에서 확인하기", emoji: true },
            url: "http://localhost:4321",
            action_id: "open_crm"
          }]
        }
      ]
    );

    // 원본 메시지를 확정 상태로 업데이트
    res.json({
      replace_original: true,
      text: `미팅 확정: ${fmtDay(date)} ${hour}:00–${hour + 1}:00`,
      blocks: confirmedBlocks(booker, date, hour)
    });
  });

}

/* ── DM 헬퍼 ─────────────────────────────────────────────────── */
async function sendDM(userId, text, blocks) {
  const open = await slackAPI("conversations.open", { users: userId });
  if (!open.ok) return { ok: false, error: open.error };
  return slackAPI("chat.postMessage", { channel: open.channel.id, text, ...(blocks ? { blocks } : {}) });
}

/* ── CRM 프론트엔드 → Slack 채널/DM 전송 (express.json 이후 등록) ── */
export function setupSlackSend(app) {
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

