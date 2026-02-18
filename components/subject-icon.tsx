"use client";

import {
  Calculator,
  Languages,
  Code,
  BookOpen,
  PenTool,
  Atom,
  type LucideIcon,
} from "lucide-react";
import type { Subject, SubjectIconName } from "@/types/study";

const ICON_MAP: Record<SubjectIconName, LucideIcon> = {
  calculator: Calculator,
  languages: Languages,
  code: Code,
  book: BookOpen,
  pen: PenTool,
  atom: Atom,
};

interface SubjectIconProps {
  subject: Subject | null;
  className?: string;
  size?: number;
  /** false のときは subject の色を使わず、className の色に任せる（例: 白抜き） */
  useSubjectColor?: boolean;
}

/** 科目の色＋アイコンを表示（科目がなければデフォルトの本アイコン） */
export function SubjectIcon({
  subject,
  className,
  size = 18,
  useSubjectColor = true,
}: SubjectIconProps) {
  const Icon = subject ? ICON_MAP[subject.icon] ?? BookOpen : BookOpen;
  const color = useSubjectColor
    ? (subject?.color ?? "hsl(var(--muted-foreground))")
    : undefined;

  return (
    <span
      className={className}
      style={color ? { color } : undefined}
      aria-hidden
    >
      <Icon size={size} strokeWidth={2} />
    </span>
  );
}
