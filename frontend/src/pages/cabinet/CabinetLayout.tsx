import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CirclePlus, Pencil, Play, Search, Trash2, FolderOpen, Clock3, ListTree } from "lucide-react";

import {
  createArea,
  createProject,
  deleteArea,
  deleteProject,
  getAreas,
  getProjects,
  getSessions,
  updateAreaName,
  updateProject,
  type AreaResponse,
  type ProjectResponse,
  type SessionResponse,
} from "@/shared/api/momentum";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const AREA_COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#f97316", "#eab308", "#ec4899", "#14b8a6"];

function hashToColor(areaId: string, areaName: string) {
  const key = `${areaId}:${areaName}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 33 + key.charCodeAt(i)) >>> 0;
  return AREA_COLORS[h % AREA_COLORS.length];
}

function calcProjectSeconds(sessions: SessionResponse[], projectId: string, nowMs: number) {
  return sessions
    .filter((s) => s.projectId === projectId)
    .reduce((sum, s) => {
      const start = new Date(s.startedAt).getTime();
      const end = s.endedAt ? new Date(s.endedAt).getTime() : nowMs;
      return end > start ? sum + (end - start) / 1000 : sum;
    }, 0);
}

function toHhMm(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}ч ${m}м`;
}

export default function CabinetLayout({
  activeSessionExists,
  onStartSession,
  refreshTick,
}: {
  activeSessionExists: boolean;
  onStartSession: (project: ProjectResponse, title: string, goal: string) => Promise<void>;
  refreshTick: number;
}) {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [areas, setAreas] = useState<AreaResponse[]>([]);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [areaColors, setAreaColors] = useState<Record<string, string>>({});

  const [areaDialogOpen, setAreaDialogOpen] = useState(false);
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [areaName, setAreaName] = useState("");
  const [areaDraftColor, setAreaDraftColor] = useState(AREA_COLORS[0]);

  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectGoal, setProjectGoal] = useState("");
  const [projectPrimaryTask, setProjectPrimaryTask] = useState("");
  const [projectTargetHours, setProjectTargetHours] = useState("");
  const [projectNotes, setProjectNotes] = useState("");

  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [startTitle, setStartTitle] = useState("");
  const [startGoal, setStartGoal] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("momentum_area_colors");
      if (raw) setAreaColors(JSON.parse(raw) as Record<string, string>);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    async function load() {
      const [areasRes, projectsRes, sessionsRes] = await Promise.all([getAreas(), getProjects(), getSessions()]);
      setAreas(areasRes);
      setProjects(projectsRes);
      setSessions(sessionsRes);
      setSelectedAreaId((prev) => prev ?? areasRes[0]?.id ?? null);
    }
    load().catch(() => undefined);
  }, [refreshTick, reloadKey]);

  function persistAreaColors(next: Record<string, string>) {
    setAreaColors(next);
    localStorage.setItem("momentum_area_colors", JSON.stringify(next));
  }

  const activeProject = useMemo(
    () => projects.find((p) => p.id === projectId) ?? null,
    [projectId, projects],
  );

  const filteredProjects = useMemo(() => {
    const byArea = selectedAreaId ? projects.filter((p) => p.areaId === selectedAreaId) : projects;
    const q = searchText.trim().toLowerCase();
    if (!q) return byArea;
    return byArea.filter((p) => p.name.toLowerCase().includes(q) || p.goal.toLowerCase().includes(q));
  }, [projects, selectedAreaId, searchText]);

  const projectSessions = useMemo(() => {
    if (!activeProject) return [];
    return sessions
      .filter((s) => s.projectId === activeProject.id)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }, [activeProject, sessions]);

  const nowMs = Date.now();

  function areaColor(area: AreaResponse) {
    return areaColors[area.id] ?? hashToColor(area.id, area.name);
  }

  function openCreateArea() {
    setEditingAreaId(null);
    setAreaName("");
    setAreaDraftColor(AREA_COLORS[0]);
    setAreaDialogOpen(true);
  }

  function openEditArea(area: AreaResponse) {
    setEditingAreaId(area.id);
    setAreaName(area.name);
    setAreaDraftColor(areaColor(area));
    setAreaDialogOpen(true);
  }

  async function submitArea() {
    const name = areaName.trim();
    if (!name) return;

    if (editingAreaId) {
      await updateAreaName(editingAreaId, { name });
      persistAreaColors({ ...areaColors, [editingAreaId]: areaDraftColor });
    } else {
      const created = await createArea({ name });
      persistAreaColors({ ...areaColors, [created.id]: areaDraftColor });
    }

    setAreaDialogOpen(false);
    setReloadKey((k) => k + 1);
  }

  function openCreateProject() {
    if (!selectedAreaId) return;
    setEditingProjectId(null);
    setProjectName("");
    setProjectGoal("");
    setProjectPrimaryTask("");
    setProjectTargetHours("");
    setProjectNotes("");
    setProjectDialogOpen(true);
  }

  function openEditProject(p: ProjectResponse) {
    setEditingProjectId(p.id);
    setProjectName(p.name);
    setProjectGoal(p.goal);
    setProjectPrimaryTask(p.primaryTask ?? "");
    setProjectTargetHours(p.targetHours?.toString() ?? "");
    setProjectNotes(p.notes ?? "");
    setProjectDialogOpen(true);
  }

  async function submitProject() {
    const name = projectName.trim();
    const goal = projectGoal.trim();
    if (!name || !goal || !selectedAreaId) return;

    const targetHours = projectTargetHours.trim() ? Number(projectTargetHours.trim()) : null;
    const payload = {
      areaId: selectedAreaId,
      name,
      goal,
      primaryTask: projectPrimaryTask.trim() || null,
      targetHours: targetHours && !Number.isNaN(targetHours) ? targetHours : null,
      notes: projectNotes.trim() || null,
    };

    if (editingProjectId) {
      await updateProject(editingProjectId, payload);
    } else {
      await createProject(payload);
    }
    setProjectDialogOpen(false);
    setReloadKey((k) => k + 1);
  }

  function openStartDialog(project: ProjectResponse) {
    setStartTitle(project.name);
    setStartGoal(project.goal);
    setStartDialogOpen(true);
  }

  async function submitStartSession() {
    if (!activeProject || !startTitle.trim() || !startGoal.trim()) return;
    await onStartSession(activeProject, startTitle.trim(), startGoal.trim());
    setStartDialogOpen(false);
  }

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background:
          "radial-gradient(1200px circle at 0% 0%, #3a1b64 0%, transparent 50%), radial-gradient(1000px circle at 100% 0%, #a83e8b 0%, transparent 55%), linear-gradient(180deg, #20153a 0%, #1a1e2f 100%)",
      }}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="overflow-hidden rounded-[18px] border border-white/20 bg-[#d7d7d9] shadow-[0_16px_45px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between border-b border-[#8f8f92] bg-gradient-to-b from-[#ededee] to-[#bcbcc0] px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#ff5f56]" />
              <span className="size-3 rounded-full bg-[#ffbd2e]" />
              <span className="size-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-sm font-semibold text-[#323236]">Momentum</div>
            <div className="w-[72px]" />
          </div>

          <div className="border-b border-[#949497] bg-gradient-to-b from-[#efeff0] to-[#d3d3d6] px-3 py-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-[#9f9fa3] bg-[#ececee] text-[#2f2f33] hover:bg-[#f8f8f8]"
                  onClick={openCreateArea}
                  disabled={activeSessionExists}
                >
                  <CirclePlus className="size-4" /> New Area
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-[#9f9fa3] bg-[#ececee] text-[#2f2f33] hover:bg-[#f8f8f8]"
                  onClick={openCreateProject}
                  disabled={activeSessionExists || !selectedAreaId}
                >
                  <CirclePlus className="size-4" /> New Project
                </Button>
              </div>

              <div className="flex items-center gap-2 rounded-md border border-[#9f9fa3] bg-white px-2 py-1">
                <Search className="size-4 text-[#7d7d83]" />
                <input
                  className="w-48 bg-transparent text-xs text-[#2b2b30] outline-none"
                  placeholder="Search projects"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid h-[78vh] grid-cols-[260px_1fr_420px] bg-[#ececef]">
            <div className="border-r border-[#b0b0b4] bg-[#d6dce5] p-2">
              <div className="mb-2 text-[11px] font-semibold tracking-wide text-[#57606e]">LIBRARY</div>
              <div className="space-y-1">
                {areas.map((a) => (
                  <div
                    key={a.id}
                    className={`rounded-md border px-2 py-2 ${
                      selectedAreaId === a.id
                        ? "border-[#6b9cd4] bg-[#6f95c8] text-white"
                        : "border-transparent bg-transparent text-[#2a2e36] hover:bg-[#c6cfdd]"
                    }`}
                  >
                    <button type="button" className="w-full text-left text-xs" onClick={() => setSelectedAreaId(a.id)}>
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ backgroundColor: areaColor(a) }} />
                        <span className="truncate font-medium">{a.name}</span>
                      </div>
                      <div className={`mt-1 text-[10px] ${selectedAreaId === a.id ? "text-white/80" : "text-[#667085]"}`}>
                        {a.projectsCount} проектов
                      </div>
                    </button>

                    <div className="mt-2 flex gap-1">
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        className={selectedAreaId === a.id ? "text-white hover:bg-white/20" : "text-[#4b5563] hover:bg-[#aebbd0]"}
                        onClick={() => openEditArea(a)}
                        disabled={activeSessionExists}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        className={selectedAreaId === a.id ? "text-white hover:bg-white/20" : "text-[#4b5563] hover:bg-[#aebbd0]"}
                        onClick={async () => {
                          if (!confirm(`Удалить область "${a.name}"?`)) return;
                          await deleteArea(a.id);
                          setReloadKey((k) => k + 1);
                        }}
                        disabled={activeSessionExists}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-r border-[#b0b0b4] bg-[#f4f4f6] p-2">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] font-semibold tracking-wide text-[#55606d]">
                  <FolderOpen className="size-3.5" />
                  PROJECTS
                </div>
                <Badge variant="outline" className="h-5 rounded border-[#b7b7bb] bg-white text-[10px] text-[#454852]">
                  {filteredProjects.length}
                </Badge>
              </div>

              {filteredProjects.map((p) => {
                const seconds = calcProjectSeconds(sessions, p.id, nowMs);
                const pct = p.targetHours ? Math.min(100, (seconds / (p.targetHours * 3600)) * 100) : 0;
                const selected = projectId === p.id;
                return (
                  <div key={p.id} className={`mb-1 rounded-md border ${selected ? "border-[#8faad0] bg-[#c5d5eb]" : "border-[#d2d2d8] bg-white"}`}>
                    <button
                      type="button"
                      className="w-full px-2 py-2 text-left"
                      onClick={() => navigate(`/app/projects/${p.id}`)}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="truncate font-semibold text-[#2d3340]">{p.name}</div>
                        <Badge variant="secondary" className="h-4 rounded text-[10px]">
                          {p.sessionsCount}
                        </Badge>
                      </div>
                      <div className="mt-1 line-clamp-2 text-[11px] text-[#5f6673]">{p.goal}</div>
                    </button>

                    <div className="px-2 pb-2">
                      <Progress value={pct} className="h-1.5 bg-[#d8dbe2]" />
                      <div className="mt-1 text-[10px] text-[#667085]">
                        {p.targetHours ? `${Math.round(pct)}% из ${p.targetHours}ч` : `Факт: ${toHhMm(seconds)}`}
                      </div>
                    </div>

                    <div className="flex gap-1 px-2 pb-2">
                      <Button
                        size="xs"
                        className="h-6 rounded-md"
                        onClick={() => {
                          navigate(`/app/projects/${p.id}`);
                          openStartDialog(p);
                        }}
                        disabled={activeSessionExists}
                      >
                        <Play className="size-4" /> Session
                      </Button>
                      <Button size="xs" variant="ghost" className="h-6 rounded-md" onClick={() => openEditProject(p)} disabled={activeSessionExists}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="h-6 rounded-md"
                        onClick={async () => {
                          if (!confirm(`Удалить проект "${p.name}"?`)) return;
                          await deleteProject(p.id);
                          navigate("/app");
                          setReloadKey((k) => k + 1);
                        }}
                        disabled={activeSessionExists}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {filteredProjects.length === 0 && (
                <div className="rounded-md border border-dashed border-[#c4c7cf] bg-white p-6 text-sm text-[#6b7280]">
                  В этой области ещё нет проектов.
                </div>
              )}
            </div>

            <div className="bg-[#f8f8f9] p-3">
              {!activeProject ? (
                <div className="grid h-full place-items-center rounded-md border border-dashed border-[#c5c8d0] bg-white text-sm text-[#6b7280]">
                  Выбери проект в центре
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-md border border-[#cbced6] bg-white p-3">
                    <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[#55606d]">
                      <ListTree className="size-3.5" />
                      PROJECT INFO
                    </div>
                    <h2 className="text-base font-semibold text-[#22262f]">{activeProject.name}</h2>
                    <p className="mt-1 text-xs text-[#61697a]">{activeProject.goal}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="h-7 rounded-md" onClick={() => openStartDialog(activeProject)} disabled={activeSessionExists}>
                        <Play className="size-4" /> Start Session
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 rounded-md border-[#bcc0ca]" onClick={() => navigate("/app")}>
                        Close
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border border-[#cbced6] bg-white p-3">
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[#55606d]">
                      <Clock3 className="size-3.5" />
                      SESSIONS
                    </div>
                    <div className="space-y-2">
                      {projectSessions.map((s) => (
                        <div key={s.id} className="rounded-md border border-[#e0e2e8] bg-[#f9f9fb] p-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[#2b3340]">{new Date(s.startedAt).toLocaleString()}</span>
                            <Badge variant={s.isActive ? "default" : "secondary"} className="h-5 text-[10px]">
                              {s.isActive ? "Active" : "Done"}
                            </Badge>
                          </div>
                          <div className="mt-1 text-[10px] text-[#6b7280]">{s.tasks.length} mini-tasks</div>
                        </div>
                      ))}
                      {projectSessions.length === 0 && (
                        <div className="text-sm text-[#6b7280]">Пока нет сессий.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={areaDialogOpen} onOpenChange={setAreaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAreaId ? "Редактировать область" : "Новая область"}</DialogTitle>
          </DialogHeader>
          <Input value={areaName} onChange={(e) => setAreaName(e.target.value)} placeholder="Название области" />
          <div className="flex flex-wrap gap-2">
            {AREA_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`size-8 rounded-full border ${areaDraftColor === c ? "border-primary" : "border-border"}`}
                style={{ backgroundColor: c }}
                onClick={() => setAreaDraftColor(c)}
              />
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => submitArea().catch(() => undefined)} disabled={!areaName.trim()}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProjectId ? "Редактировать проект" : "Новый проект"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Название" />
            <Textarea value={projectGoal} onChange={(e) => setProjectGoal(e.target.value)} placeholder="Цель" />
            <Input value={projectPrimaryTask} onChange={(e) => setProjectPrimaryTask(e.target.value)} placeholder="Primary task (опц.)" />
            <Input value={projectTargetHours} onChange={(e) => setProjectTargetHours(e.target.value)} placeholder="План часов (опц.)" />
            <Textarea value={projectNotes} onChange={(e) => setProjectNotes(e.target.value)} placeholder="Заметки (опц.)" />
          </div>
          <DialogFooter>
            <Button onClick={() => submitProject().catch(() => undefined)} disabled={!projectName.trim() || !projectGoal.trim()}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={startDialogOpen} onOpenChange={setStartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Старт сессии</DialogTitle>
          </DialogHeader>
          <Input value={startTitle} onChange={(e) => setStartTitle(e.target.value)} placeholder="Название сессии" />
          <Textarea value={startGoal} onChange={(e) => setStartGoal(e.target.value)} placeholder="Цель на сессию" />
          <DialogFooter>
            <Button
              onClick={() => submitStartSession().catch(() => undefined)}
              disabled={!startTitle.trim() || !startGoal.trim() || activeSessionExists}
            >
              Начать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

