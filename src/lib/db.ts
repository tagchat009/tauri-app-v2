import Database from "@tauri-apps/plugin-sql";
import type { DonationRecord } from "@/types";

const STORAGE_KEY = "donation_history";

let _db: Database | null = null;

function isTauri(): boolean {
  return typeof window !== "undefined" && (window as any).__TAURI__ !== undefined;
}

async function getDb(): Promise<Database> {
  if (!isTauri()) {
    throw new Error("Tauri database unavailable in this environment");
  }

  if (_db) return _db;
  _db = await Database.load("sqlite:cong_duc.db");
  await _db.execute(`
    CREATE TABLE IF NOT EXISTS donations (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      name    TEXT    NOT NULL,
      addr    TEXT    NOT NULL DEFAULT '',
      amount  TEXT    NOT NULL DEFAULT '',
      words   TEXT    NOT NULL DEFAULT '',
      created INTEGER NOT NULL
    )
  `);
  return _db;
}

function getFallbackHistory(): DonationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DonationRecord[];
  } catch {
    return [];
  }
}

function setFallbackHistory(list: DonationRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function addRecord(data: Omit<DonationRecord, "id">): Promise<void> {
  if (!isTauri()) {
    const history = getFallbackHistory();
    const nextId = history.length ? Math.max(...history.map((r) => r.id ?? 0)) + 1 : 1;
    setFallbackHistory([...history, { id: nextId, ...data }]);
    return;
  }

  const db = await getDb();
  await db.execute(
    "INSERT INTO donations (name, addr, amount, words, created) VALUES (?, ?, ?, ?, ?)",
    [data.name, data.addr, data.amount, data.words, data.created]
  );
}

export async function getAllRecords(): Promise<DonationRecord[]> {
  if (!isTauri()) {
    return getFallbackHistory().sort((a, b) => b.created - a.created);
  }

  const db = await getDb();
  const rows = await db.select<DonationRecord[]>(
    "SELECT * FROM donations ORDER BY created DESC"
  );
  return rows;
}

export async function deleteRecord(id: number): Promise<void> {
  if (!isTauri()) {
    const history = getFallbackHistory();
    setFallbackHistory(history.filter((item) => item.id !== id));
    return;
  }

  const db = await getDb();
  await db.execute("DELETE FROM donations WHERE id = ?", [id]);
}

export async function clearAllRecords(): Promise<void> {
  if (!isTauri()) {
    setFallbackHistory([]);
    return;
  }

  const db = await getDb();
  await db.execute("DELETE FROM donations");
}
