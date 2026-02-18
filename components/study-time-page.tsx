"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { format, startOfDay } from "date-fns";
import { ja } from "date-fns/locale";
import { Clock, BookOpen, Trash2, Play, Square, Settings2, Plus, Pencil, Target, Pause } from "lucide-react";
import type { StudyRecord, Subject } from "@/types/study";
import { getRecords, addRecord, deleteRecord, updateRecord, getTodayTargetHours, saveTodayTargetHours } from "@/lib/storage";
import {
  getSubjects,
  getSubjectByName,
  addSubject,
  deleteSubject,
} from "@/lib/subjects";
import { SubjectIcon } from "@/components/subject-icon";
import { WeeklyChart } from "@/components/weekly-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}分`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}時間${m}分` : `${h}時間`;
}

/** 秒数を HH:MM:SS または M:SS で表示 */
function formatStopwatch(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${m}:${pad(s)}`;
}

export function StudyTimePage() {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [subject, setSubject] = useState("");
  const [startedAt, setStartedAt] = useState(() =>
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [memo, setMemo] = useState("");

  // 科目一覧（デフォルト＋カスタム）
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  // 編集モーダル
  const [editingRecord, setEditingRecord] = useState<StudyRecord | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editStartedAt, setEditStartedAt] = useState("");
  const [editDurationMinutes, setEditDurationMinutes] = useState(30);
  const [editMemo, setEditMemo] = useState("");
  const editDialogRef = useRef<HTMLDialogElement>(null);

  // 目標学習時間
  const [targetHours, setTargetHours] = useState<number | null>(null);
  const [targetInputValue, setTargetInputValue] = useState("");

  const loadTargetHours = useCallback(() => {
    const saved = getTodayTargetHours();
    setTargetHours(saved);
    setTargetInputValue(saved !== null ? saved.toString() : "");
  }, []);

  useEffect(() => {
    loadTargetHours();
  }, [loadTargetHours]);

  const handleSetTarget = () => {
    const hours = parseFloat(targetInputValue);
    if (isNaN(hours) || hours <= 0) return;
    saveTodayTargetHours(hours);
    setTargetHours(hours);
  };

  const loadSubjects = useCallback(() => {
    setSubjects(getSubjects());
  }, []);

  // タイマー（ストップウォッチ）
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [pausedElapsedSeconds, setPausedElapsedSeconds] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isTimerRunning || isPaused || timerStartTime === null) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }
    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const totalElapsed = pausedElapsedSeconds + Math.floor((now - timerStartTime) / 1000);
      setElapsedSeconds(totalElapsed);
    }, 100);
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isTimerRunning, isPaused, timerStartTime, pausedElapsedSeconds]);

  const handleStartTimer = () => {
    const now = Date.now();
    setTimerStartTime(now);
    setStartedAt(format(new Date(now), "yyyy-MM-dd'T'HH:mm"));
    setIsTimerRunning(true);
    setIsPaused(false);
    setPausedElapsedSeconds(0);
    setElapsedSeconds(0);
  };

  const handlePauseTimer = () => {
    if (timerStartTime !== null) {
      const now = Date.now();
      const currentElapsed = pausedElapsedSeconds + Math.floor((now - timerStartTime) / 1000);
      setPausedElapsedSeconds(currentElapsed);
      setElapsedSeconds(currentElapsed);
    }
    setIsPaused(true);
  };

  const handleResumeTimer = () => {
    const now = Date.now();
    setTimerStartTime(now);
    setIsPaused(false);
  };

  const handleStopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    const total = elapsedSeconds;
    setDurationMinutes(Math.max(1, Math.ceil(total / 60)));
    setIsTimerRunning(false);
    setIsPaused(false);
    setTimerStartTime(null);
    setPausedElapsedSeconds(0);
    setElapsedSeconds(0);
  };

  const loadRecords = useCallback(() => {
    setRecords(() => getRecords());
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  useEffect(() => {
    if (editingRecord) {
      setEditSubject(editingRecord.subject);
      setEditStartedAt(
        format(new Date(editingRecord.startedAt), "yyyy-MM-dd'T'HH:mm")
      );
      setEditDurationMinutes(editingRecord.durationMinutes);
      setEditMemo(editingRecord.memo ?? "");
      editDialogRef.current?.showModal();
    } else {
      editDialogRef.current?.close();
    }
  }, [editingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    const started = new Date(startedAt);
    addRecord({
      subject: subject.trim(),
      startedAt: started.toISOString(),
      durationMinutes,
      memo: memo.trim() || undefined,
    });
    setSubject("");
    setStartedAt(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    setDurationMinutes(30);
    setMemo("");
    loadRecords();
  };

  const handleDelete = (id: string) => {
    if (typeof window !== "undefined" && !window.confirm("この記録を削除しますか？")) return;
    deleteRecord(id);
    loadRecords();
  };

  const handleAddSubject = () => {
    if (addSubject(newSubjectName)) {
      setNewSubjectName("");
      loadSubjects();
    }
  };

  const handleDeleteSubject = (id: string) => {
    if (deleteSubject(id)) loadSubjects();
  };

  const handleEditSave = () => {
    if (!editingRecord || !editSubject.trim()) return;
    updateRecord({
      ...editingRecord,
      subject: editSubject.trim(),
      startedAt: new Date(editStartedAt).toISOString(),
      durationMinutes: editDurationMinutes,
      memo: editMemo.trim() || undefined,
    });
    loadRecords();
    setEditingRecord(null);
  };

  const handleEditCancel = () => {
    setEditingRecord(null);
  };

  const today = startOfDay(new Date()).toISOString();
  const todayMinutes = records
    .filter((r) => r.startedAt.startsWith(today.slice(0, 10)))
    .reduce((sum, r) => sum + r.durationMinutes, 0);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-cyan-50/80 via-white to-slate-50">
      <div className="pointer-events-none absolute inset-x-0 top-[-140px] h-[320px] bg-gradient-to-r from-cyan-200/50 via-sky-100/40 to-transparent blur-3xl" />
      {/* 編集モーダル */}
      <dialog
        ref={editDialogRef}
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-0 shadow-lg backdrop:bg-black/30"
        onCancel={handleEditCancel}
        onClick={(e) => {
          if (e.target === editDialogRef.current) handleEditCancel();
        }}
      >
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold">記録を編集</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSave();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-subject">科目</Label>
              <Input
                id="edit-subject"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                placeholder="科目名"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startedAt">いつ</Label>
                <Input
                  id="edit-startedAt"
                  type="datetime-local"
                  value={editStartedAt}
                  onChange={(e) => setEditStartedAt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">所要時間（分）</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  min={1}
                  max={600}
                  value={editDurationMinutes}
                  onChange={(e) =>
                    setEditDurationMinutes(Number(e.target.value) || 30)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-memo">メモ</Label>
              <Input
                id="edit-memo"
                value={editMemo}
                onChange={(e) => setEditMemo(e.target.value)}
                placeholder="メモ（任意）"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" disabled={!editSubject.trim()}>
                保存
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleEditCancel}
              >
                キャンセル
              </Button>
            </div>
          </form>
        </div>
      </dialog>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <header className="mb-8 text-center">
          <h1 className="flex items-center justify-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-500 bg-clip-text text-transparent">
              作業時間記録
            </span>
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            何を・いつ・どれくらいやったか記録しよう
          </p>
        </header>

        <div className="space-y-6">
          {/* 目標学習時間の設定 */}
          <Card className="border-cyan-200/50 bg-gradient-to-br from-cyan-50/50 to-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-cyan-600" />
                今日の目標学習時間
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  placeholder="例: 2.5"
                  value={targetInputValue}
                  onChange={(e) => setTargetInputValue(e.target.value)}
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground">
                  時間
                </span>
                <Button
                  type="button"
                  onClick={handleSetTarget}
                  disabled={!targetInputValue || parseFloat(targetInputValue) <= 0}
                  size="sm"
                >
                  設定
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 今日の合計と進捗 */}
          <Card
            className={cn(
              "transition-colors",
              targetHours !== null && todayMinutes >= targetHours * 60
                ? "border-green-500/50 bg-gradient-to-br from-green-50/80 to-green-100/40 shadow-md"
                : "border-primary/20 bg-primary/5"
            )}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">
                  今日の合計
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-xl font-semibold",
                    targetHours !== null && todayMinutes >= targetHours * 60
                      ? "text-green-600"
                      : "text-primary"
                  )}
                >
                  <Clock className="h-5 w-5" />
                  {formatDuration(todayMinutes)}
                  {targetHours !== null && (
                    <span className="text-sm font-normal text-muted-foreground">
                      / {targetHours}時間
                    </span>
                  )}
                </span>
              </div>
              {targetHours !== null && (
                <>
                  <Progress
                    value={todayMinutes}
                    max={targetHours * 60}
                    className={cn(
                      "h-3 mb-2",
                      todayMinutes >= targetHours * 60
                        ? "[&>div]:bg-green-500"
                        : "[&>div]:bg-primary"
                    )}
                  />
                  {todayMinutes >= targetHours * 60 && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 font-semibold animate-in">
                      <span className="text-lg">🎉</span>
                      <span>おめでとう！目標を達成しました！</span>
                    </div>
                  )}
                  {todayMinutes < targetHours * 60 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      あと {formatDuration(Math.max(0, targetHours * 60 - todayMinutes))} で目標達成
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* 週間の学習時間グラフ */}
          <Card className="overflow-hidden border-cyan-200/50 bg-gradient-to-b from-cyan-50/50 to-card">
            <CardHeader>
              <CardTitle className="text-lg">週間の学習時間グラフ</CardTitle>
              <CardDescription>
                直近7日間の合計と科目ごとの割合
              </CardDescription>
            </CardHeader>
            <CardContent className="min-w-0 overflow-hidden">
              <WeeklyChart records={records} />
            </CardContent>
          </Card>

          {/* 記録フォーム */}
          <Card>
            <CardHeader>
              <CardTitle>記録を追加</CardTitle>
              <CardDescription>
                科目やタスク名、開始時刻、所要時間を入力
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* タイマー（ストップウォッチ） */}
              <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
                <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
                  タイマーで計測
                </p>
                <div
                  className="mb-4 flex min-h-[100px] items-center justify-center font-mono tabular-nums sm:min-h-[120px]"
                  aria-live="polite"
                  aria-label={
                    isTimerRunning
                      ? isPaused
                        ? `一時停止中 ${formatStopwatch(elapsedSeconds)}`
                        : `計測中 ${formatStopwatch(elapsedSeconds)}`
                      : "ストップウォッチ"
                  }
                >
                  <span
                    className={cn(
                      "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
                      isTimerRunning
                        ? isPaused
                          ? "text-muted-foreground"
                          : "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatStopwatch(elapsedSeconds)}
                  </span>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  {!isTimerRunning ? (
                    <Button
                      type="button"
                      onClick={handleStartTimer}
                      className="min-h-12 w-full shrink-0 py-3 text-base [touch-action:manipulation] sm:min-w-[140px] sm:w-auto"
                    >
                      <Play className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                      計測開始
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant={isPaused ? "default" : "outline"}
                        onClick={isPaused ? handleResumeTimer : handlePauseTimer}
                        className="min-h-12 w-full shrink-0 py-3 text-base [touch-action:manipulation] sm:min-w-[140px] sm:w-auto"
                      >
                        {isPaused ? (
                          <>
                            <Play className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                            再開
                          </>
                        ) : (
                          <>
                            <Pause className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                            一時停止
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleStopTimer}
                        className="min-h-12 w-full shrink-0 py-3 text-base [touch-action:manipulation] sm:min-w-[140px] sm:w-auto"
                      >
                        <Square className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                        終了
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>何をやったか</Label>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((s) => (
                      <Button
                        key={s.id}
                        type="button"
                        variant={subject === s.name ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "shrink-0",
                          subject === s.name && "text-white hover:opacity-90"
                        )}
                        style={
                          subject === s.name
                            ? { backgroundColor: s.color, borderColor: s.color }
                            : undefined
                        }
                        onClick={() => setSubject(s.name)}
                      >
                        <SubjectIcon subject={s} size={14} className="mr-1.5 opacity-90" />
                        {s.name}
                      </Button>
                    ))}
                  </div>
                  <Input
                    id="subject"
                    placeholder="その他・自由入力"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-2 placeholder:text-muted-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startedAt">いつ</Label>
                    <Input
                      id="startedAt"
                      type="datetime-local"
                      value={startedAt}
                      onChange={(e) => setStartedAt(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">所要時間（分）</Label>
                    <Input
                      id="duration"
                      type="number"
                      min={1}
                      max={600}
                      value={durationMinutes}
                      onChange={(e) =>
                        setDurationMinutes(Number(e.target.value) || 30)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memo">メモ（任意）</Label>
                  <Input
                    id="memo"
                    placeholder="例: 第3章まで"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="placeholder:text-muted-foreground"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!subject.trim()}>
                  記録を追加
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 記録一覧 */}
          <Card>
            <CardHeader>
              <CardTitle>記録一覧</CardTitle>
              <CardDescription>
                新しい順に表示（ブラウザに保存）
              </CardDescription>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  まだ記録がありません。上のフォームから追加してください。
                </p>
              ) : (
                <ul className="space-y-3">
                  {records.map((record) => {
                  const recordSubject = getSubjectByName(record.subject);
                  return (
                    <li
                      key={record.id}
                      className={cn(
                        "flex flex-wrap items-center gap-3 rounded-lg border bg-card px-4 py-3",
                        "animate-in"
                      )}
                      style={{
                        borderLeftWidth: 4,
                        borderLeftColor: recordSubject?.color ?? "hsl(var(--border))",
                      }}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted/80"
                        style={{
                          color: recordSubject?.color ?? "hsl(var(--muted-foreground))",
                        }}
                      >
                        <SubjectIcon subject={recordSubject} size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">
                          {record.subject}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(record.startedAt),
                            "M/d(E) HH:mm",
                            { locale: ja }
                          )}
                          {" · "}
                          {formatDuration(record.durationMinutes)}
                          {record.memo ? ` · ${record.memo}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => setEditingRecord(record)}
                          aria-label="編集"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(record.id)}
                          aria-label="削除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* 科目の管理（設定） */}
          <Card className="border-muted">
            <CardHeader className="py-4">
              <button
                type="button"
                onClick={() => setSettingsOpen((o) => !o)}
                className="flex w-full items-center justify-between text-left"
              >
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                  科目の管理
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {settingsOpen ? "閉じる" : "開く"}
                </span>
              </button>
            </CardHeader>
            {settingsOpen && (
              <CardContent className="space-y-3 border-t border-border pt-2">
                <p className="text-xs text-muted-foreground">
                  新しい科目を追加できます。数学・英語・プログラミングは固定です。
                </p>
                <ul className="space-y-1.5">
                  {subjects.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
                    >
                      <span
                        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: s.color }}
                      >
                        <SubjectIcon
                          subject={s}
                          size={12}
                          useSubjectColor={false}
                          className="text-white"
                        />
                      </span>
                      <span className="min-w-0 flex-1 font-medium">{s.name}</span>
                      {!s.isDefault && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteSubject(s.id)}
                          aria-label={`${s.name}を削除`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Input
                    placeholder="新しい科目名"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddSubject())
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddSubject}
                    disabled={!newSubjectName.trim()}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    追加
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
