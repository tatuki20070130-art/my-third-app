"use client";

import type { Subject, SubjectIconName } from "@/types/study";

const STORAGE_KEY = "study-subjects";

const DEFAULT_SUBJECTS: Subject[] = [
  { id: "math", name: "数学", color: "#3b82f6", icon: "calculator", isDefault: true },
  { id: "english", name: "英語", color: "#22c55e", icon: "languages", isDefault: true },
  { id: "programming", name: "プログラミング", color: "#a855f7", icon: "code", isDefault: true },
];

const CUSTOM_COLOR_PALETTE = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#06b6d4",
  "#ec4899",
  "#8b5cf6",
];

function getCustomSubjects(): Subject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Subject[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCustomSubjects(subjects: Subject[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}

/** デフォルト＋カスタムを合わせた科目一覧（表示順） */
export function getSubjects(): Subject[] {
  const custom = getCustomSubjects();
  return [...DEFAULT_SUBJECTS, ...custom];
}

/** 名前で科目を取得（見つからなければ null） */
export function getSubjectByName(name: string): Subject | null {
  const list = getSubjects();
  return list.find((s) => s.name === name) ?? null;
}

/** 新しい科目を追加（カスタムのみ） */
export function addSubject(name: string): Subject | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const list = getSubjects();
  if (list.some((s) => s.name === trimmed)) return null;
  const custom = getCustomSubjects();
  const color = CUSTOM_COLOR_PALETTE[custom.length % CUSTOM_COLOR_PALETTE.length];
  const newSubject: Subject = {
    id: crypto.randomUUID(),
    name: trimmed,
    color,
    icon: "book",
    isDefault: false,
  };
  saveCustomSubjects([...custom, newSubject]);
  return newSubject;
}

/** 科目を削除（カスタムのみ。isDefault は削除不可） */
export function deleteSubject(id: string): boolean {
  const custom = getCustomSubjects();
  const subject = custom.find((s) => s.id === id);
  if (!subject || subject.isDefault) return false;
  saveCustomSubjects(custom.filter((s) => s.id !== id));
  return true;
}
