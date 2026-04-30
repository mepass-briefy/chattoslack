import express from "express";
import cors from "cors";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { kvGet, kvSet, kvDel } from "./db.js";
import { setupSlack, setupSlackSend } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env 로드
const envPath = join(__dirname, "..", ".env");
if (existsSync(envPath)) {
  readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const [k, ...v] = line.split("=");
      if (k && v.length) process.env[k.trim()] = v.join("=").trim();
    });
}

const IS_PROD = process.env.NODE_ENV === "production";
const PORT = IS_PROD ? 4321 : 4322;

const app = express();
app.use(cors());
app.use((req, _res, next) => { console.log(`[REQ] ${req.method} ${req.path}`); next(); });

/* ── Slack 라우트: raw body 필요하므로 JSON 미들웨어 전에 등록 ── */
setupSlack(app);

/* ── 나머지 라우트: JSON 파싱 ────────────────────────────────── */
app.use(express.json({ limit: "10mb" }));
setupSlackSend(app);

/* ── KV Storage API ──────────────────────────────────────────── */
app.get("/api/kv/:key", (req, res) => {
  const value = kvGet(decodeURIComponent(req.params.key));
  res.json({ value });
});

app.put("/api/kv/:key", (req, res) => {
  const { value } = req.body;
  kvSet(decodeURIComponent(req.params.key), value);
  res.json({ ok: true });
});

app.delete("/api/kv/:key", (req, res) => {
  kvDel(decodeURIComponent(req.params.key));
  res.json({ ok: true });
});

/* ── 파일 텍스트 추출 (docx) ─────────────────────────────────── */
app.post("/api/extract-text", async (req, res) => {
  const { filename, content } = req.body; // content: base64
  if (!filename || !content) return res.status(400).json({ error: "filename/content 필요" });
  const ext = filename.split(".").pop().toLowerCase();
  try {
    if (ext === "docx") {
      const mammoth = await import("mammoth");
      const buffer = Buffer.from(content, "base64");
      const result = await mammoth.extractRawText({ buffer });
      return res.json({ text: result.value });
    }
    return res.status(400).json({ error: "지원하지 않는 형식입니다. (docx만 서버 처리)" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ── Anthropic AI Proxy ──────────────────────────────────────── */
app.post("/api/ai", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "여기에_API_키_입력") {
    return res.status(500).json({ error: ".env 파일에 ANTHROPIC_API_KEY를 설정해 주세요." });
  }
  const { userMsg, sysMsg, maxTok, webSearch } = req.body;
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: maxTok || 2000,
    messages: [{ role: "user", content: userMsg }],
  };
  if (sysMsg) body.system = sysMsg;
  if (webSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "interleaved-thinking-2025-05-14",
      },
      body: JSON.stringify(body),
    });
    const data = await upstream.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ── Prod: React static 서빙 ─────────────────────────────────── */
if (IS_PROD) {
  const distPath = join(__dirname, "..", "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(join(distPath, "index.html")));
}

app.listen(PORT, () => {
  console.log(`GRIDGE CRM server → http://localhost:${PORT}`);
  if (!IS_PROD) console.log("  API proxy: Vite 4321 → Express 4322");
  if (process.env.SLACK_BOT_TOKEN) console.log("  Slack bot: 활성화됨");
});
