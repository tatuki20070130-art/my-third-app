"use client";

import type { StudyRecord } from "@/types/study";

const STORAGE_KEY = "study-time-records";

export function getRecords(): StudyRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StudyRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecords(records: StudyRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addRecord(record: Omit<StudyRecord, "id">): StudyRecord {
  const records = getRecords();
  const newRecord: StudyRecord = {
    ...record,
    id: crypto.randomUUID(),
  };
  saveRecords([newRecord, ...records]);
  return newRecord;
}

export function deleteRecord(id: string): void {
  const records = getRecords().filter((r) => r.id !== id);
  saveRecords(records);
}

export function updateRecord(updated: StudyRecord): void {
  const records = getRecords().map((r) =>
    r.id === updated.id ? updated : r
  );
  saveRecords(records);
}

const TARGET_STORAGE_KEY = "study-target-hours";

/** 今日の目標学習時間（時間）を取得 */
export function getTodayTargetHours(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem(TARGET_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, number>;
    return data[today] ?? null;
  } catch {
    return null;
  }
}

/** 今日の目標学習時間（時間）を保存 */
export function saveTodayTargetHours(hours: number): void {
  if (typeof window === "undefined") return;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem(TARGET_STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    data[today] = hours;
    localStorage.setItem(TARGET_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // エラー時は無視
  }
}
