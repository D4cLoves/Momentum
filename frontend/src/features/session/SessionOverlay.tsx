import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import { endSession, type SessionResponse, createSessionTask, deleteSessionTask, updateSessionTaskStatus } from "@/shared/api/momentum";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatHMS(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`;
}

export default function SessionOverlay({
  session,
  onSessionFinished,
}: {
  session: SessionResponse;
  onSessionFinished: () => Promise<void>;
}) {
  const startedAtMs = useMemo(() => new Date(session.startedAt).getTime(), [session.startedAt]);
  const [now, setNow] = useState(() => Date.now());

  const [notes, setNotes] = useState<string>(session.notes ?? "");
  const [tasks, setTasks] = useState(session.tasks);
  const [localTasks, setLocalTasks] = useState<Array<{ id: string; description: string; isCompleted: boolean }>>([]);
  const [taskDraft, setTaskDraft] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    setNotes(session.notes ?? "");
    setTasks(session.tasks);
    setLocalTasks([]);
    setTaskDraft("");
    setErrorText(null);
    setNow(Date.now());
  }, [session]);

  useEffect(() => {
    if (!session.isActive) return;
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, [session.isActive]);

  const durationSeconds = useMemo(() => (now - startedAtMs) / 1000, [now, startedAtMs]);

  async function addTask() {
    const description = taskDraft.trim();
    if (!description) return;
    setErrorText(null);
    try {
      const created = await createSessionTask(session.id, { description });
      setTasks((prev) => [...prev, created]);
    } catch {
      // Fallback so user can still work even if backend endpoint is unavailable.
      setLocalTasks((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          description,
          isCompleted: false,
        },
      ]);
      setErrorText("Сервер не принял мини-таск. Он сохранится локально и будет добавлен в заметки при финише.");
    }
    setTaskDraft("");
  }

  async function toggleTask(taskId: string, nextIsCompleted: boolean) {
    setErrorText(null);
    if (taskId.startsWith("local-")) {
      setLocalTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, isCompleted: nextIsCompleted } : t)),
      );
      return;
    }
    try {
      const updated = await updateSessionTaskStatus(session.id, taskId, { isCompleted: nextIsCompleted });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch {
      setErrorText("Не получилось обновить статус мини-таска.");
    }
  }

  async function removeTask(taskId: string) {
    setErrorText(null);
    if (taskId.startsWith("local-")) {
      setLocalTasks((prev) => prev.filter((t) => t.id !== taskId));
      return;
    }
    try {
      await deleteSessionTask(session.id, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch {
      setErrorText("Не получилось удалить мини-таск.");
    }
  }

  async function finish() {
    setIsFinishing(true);
    try {
      const localTasksText =
        localTasks.length === 0
          ? ""
          : `\n\n[Локальные мини-таски]\n${localTasks
              .map((t) => `- [${t.isCompleted ? "x" : " "}] ${t.description}`)
              .join("\n")}`;
      const combinedNotes = `${notes.trim()}${localTasksText}`.trim();
      await endSession(session.id, { notes: combinedNotes.length ? combinedNotes : null });
      await onSessionFinished();
    } finally {
      setIsFinishing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 bg-black/35 backdrop-blur-xl" />

      <div className="relative mx-auto flex max-w-3xl items-center justify-center px-4 py-8">
        <Card className="w-full rounded-3xl border-white/10 bg-white/5 p-5 backdrop-blur-xl animate-in fade-in zoom-in-95">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Сессия</div>
                <div className="text-xl font-semibold">{session.title ?? "Без названия"}</div>
                {session.goal && <div className="text-sm text-muted-foreground">{session.goal}</div>}
              </div>

              <div className="text-right">
                <div className="text-xs text-muted-foreground">Время</div>
                <div className="font-mono text-3xl tabular-nums">{formatHMS(durationSeconds)}</div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Мини-таски</div>
                  <div className="text-xs text-muted-foreground">
                    {tasks.filter((t) => t.isCompleted).length + localTasks.filter((t) => t.isCompleted).length}/
                    {tasks.length + localTasks.length}
                  </div>
                </div>

                <div className="space-y-2">
                  {[...tasks, ...localTasks].map((t) => (
                    <div key={t.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 p-3">
                      <Checkbox
                        checked={t.isCompleted}
                        onCheckedChange={(v) => toggleTask(t.id, v === true)}
                      />
                      <div className="min-w-0 flex-1">
                        <div className={t.isCompleted ? "line-through text-muted-foreground" : ""}>
                          {t.description}
                          {t.id.startsWith("local-") && (
                            <span className="ml-2 text-[10px] text-amber-400">(local)</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTask(t.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Удалить</span>
                      </Button>
                    </div>
                  ))}

                  {tasks.length + localTasks.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-black/10 p-4 text-sm text-muted-foreground">
                      Добавь мини-таск — и отмечай прогресс прямо во время таймера.
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Input
                    value={taskDraft}
                    onChange={(e) => setTaskDraft(e.target.value)}
                    placeholder="Например: Разминка 5 минут"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addTask();
                    }}
                  />
                  <Button onClick={addTask} disabled={!taskDraft.trim()}>
                    Добавить
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">Заметки</div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Инсайты, результат, что получилось…"
                  className="min-h-[180px] resize-none"
                />

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-xs text-muted-foreground">
                  Пока сессия активна — кабинет заблокирован. Нажми «Финиш», чтобы сохранить всё.
                </div>
                {errorText && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                    {errorText}
                  </div>
                )}

                <div className="flex items-center justify-end">
                  <Button
                    onClick={finish}
                    disabled={isFinishing}
                    className="w-full rounded-2xl bg-primary/90 hover:bg-primary"
                  >
                    {isFinishing ? "Финиширую..." : "Финиш"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

