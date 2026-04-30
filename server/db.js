import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(join(__dirname, "..", "gridge.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS kv_store (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

export function kvGet(key) {
  const row = db.prepare("SELECT value FROM kv_store WHERE key = ?").get(key);
  if (!row) return null;
  try { return JSON.parse(row.value); } catch { return null; }
}

export function kvSet(key, value) {
  db.prepare(`
    INSERT INTO kv_store (key, value, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(key, JSON.stringify(value));
}

export function kvDel(key) {
  db.prepare("DELETE FROM kv_store WHERE key = ?").run(key);
}

// 특정 prefix로 시작하는 모든 키-값 반환
export function kvScan(prefix) {
  return db.prepare("SELECT key, value FROM kv_store WHERE key LIKE ?")
    .all(prefix + "%")
    .map(r => ({ key: r.key, value: (() => { try { return JSON.parse(r.value); } catch { return null; } })() }));
}

export default db;
