/** 1件の作業時間記録（何を・いつ・どれくらい） */
export interface StudyRecord {
  id: string;
  /** 何をやったか（科目・タスク名など） */
  subject: string;
  /** いつ（開始日時） */
  startedAt: string; // ISO 8601
  /** どれくらい（分数） */
  durationMinutes: number;
  /** メモ（任意） */
  memo?: string;
}

export type NewStudyRecord = Omit<StudyRecord, "id">;

/** 科目（選択肢・一覧の色・アイコン用） */
export interface Subject {
  id: string;
  name: string;
  /** 表示用の色（hex） */
  color: string;
  /** アイコン識別子（lucide 名） */
  icon: SubjectIconName;
  /** デフォルト科目は削除不可 */
  isDefault?: boolean;
}

export type SubjectIconName =
  | "calculator"
  | "languages"
  | "code"
  | "book"
  | "pen"
  | "atom";
