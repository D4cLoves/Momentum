'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ChevronRight, FileIcon, FolderIcon } from 'lucide-react';
import {
  FileItem,
  Files,
  FolderContent,
  FolderItem,
  FolderTrigger,
  SubFiles,
} from '@/components/animate-ui/components/radix/files';
import {
  type CreateProjectPayload,
  createArea,
  createProject,
  deleteArea,
  deleteProject,
  getAreas,
  getProjects,
  startSession,
  updateAreaName,
  updateProject,
  type AreaDto,
  type ProjectDto,
  type UpdateProjectPayload,
} from '@/api/cabinetApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/animate-ui/components/radix/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/animate-ui/components/radix/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type AreaWithProjects = AreaDto & { projects: ProjectDto[] };

type FocusedProjectPayload = {
  project: ProjectDto;
  area: AreaDto | null;
};

type RadixFilesDemoProps = {
  onProjectFocus?: (payload: FocusedProjectPayload | null) => void;
  onTreeMutated?: () => void;
};

type ContextRowMenuProps = {
  children: ReactNode;
  menu: ReactNode;
  onContextOpen?: () => void;
};

type DeleteTarget =
  | { kind: 'area'; id: string; name: string }
  | { kind: 'project'; id: string; name: string };

type ActionDialogMode =
  | 'rename-area'
  | 'create-session'
  | 'edit-project-name'
  | 'edit-project-goal'
  | 'edit-project-task'
  | 'edit-project-hours';

type ActionDialogState = {
  mode: ActionDialogMode;
  title: string;
  description: string;
  fieldLabel: string;
  value: string;
  areaId?: string;
  project?: ProjectDto;
};

type CreateProjectDialogState = {
  areaId: string;
  areaName: string;
  name: string;
  goal: string;
  primaryTask: string;
  targetHours: string;
  notes: string;
};

function ContextRowMenu({ children, menu, onContextOpen }: ContextRowMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <div
          className="rounded-md"
          onPointerDown={(event) => {
            if (event.button !== 0) {
              return;
            }

            event.preventDefault();
            if (isOpen) {
              setIsOpen(false);
            }
          }}
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            }
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            onContextOpen?.();
            setIsOpen(true);
          }}
        >
          {children}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className={cn('w-56')}
        onPointerDownOutside={() => setIsOpen(false)}
        onEscapeKeyDown={() => setIsOpen(false)}
      >
        {menu}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getReadableError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const RadixFilesDemo = ({ onProjectFocus, onTreeMutated }: RadixFilesDemoProps) => {
  const [areas, setAreas] = useState<AreaDto[]>([]);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRootOpen, setIsRootOpen] = useState(true);
  const [openAreaNodes, setOpenAreaNodes] = useState<string[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [createProjectDialog, setCreateProjectDialog] = useState<CreateProjectDialogState | null>(
    null,
  );
  const [isCreateProjectSubmitting, setIsCreateProjectSubmitting] = useState(false);

  const [actionDialog, setActionDialog] = useState<ActionDialogState | null>(null);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const [inlineAreaName, setInlineAreaName] = useState<string | null>(null);
  const [isInlineAreaSubmitting, setIsInlineAreaSubmitting] = useState(false);
  const inlineAreaInputRef = useRef<HTMLInputElement | null>(null);
  const didAutoFocusInlineAreaRef = useRef(false);

  const groupedAreas = useMemo<AreaWithProjects[]>(() => {
    const areaMap = new Map<string, AreaWithProjects>(
      areas.map((area) => [area.id, { ...area, projects: [] }]),
    );

    for (const project of projects) {
      const targetArea = areaMap.get(project.areaId);
      if (targetArea) {
        targetArea.projects.push(project);
      }
    }

    return [...areaMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [areas, projects]);

  const focusProject = useCallback(
    (project: ProjectDto | null) => {
      if (!project) {
        setSelectedProjectId(null);
        onProjectFocus?.(null);
        return;
      }

      setSelectedProjectId(project.id);
      const area = areas.find((candidate) => candidate.id === project.areaId) ?? null;
      onProjectFocus?.({ project, area });
    },
    [areas, onProjectFocus],
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [loadedAreas, loadedProjects] = await Promise.all([
        getAreas(),
        getProjects(),
      ]);

      setAreas(loadedAreas);
      setProjects(loadedProjects);
    } catch (err) {
      setError(getReadableError(err, 'Failed to load areas and projects.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    const validAreaNodes = new Set(areas.map((area) => `area-${area.id}`));
    setOpenAreaNodes((previous) => previous.filter((node) => validAreaNodes.has(node)));
  }, [areas]);

  useEffect(() => {
    if (!selectedProjectId) {
      return;
    }

    const exists = projects.some((project) => project.id === selectedProjectId);
    if (!exists) {
      focusProject(null);
    }
  }, [focusProject, projects, selectedProjectId]);

  useEffect(() => {
    if (inlineAreaName === null) {
      didAutoFocusInlineAreaRef.current = false;
      return;
    }

    if (!didAutoFocusInlineAreaRef.current) {
      inlineAreaInputRef.current?.focus();
      inlineAreaInputRef.current?.select();
      didAutoFocusInlineAreaRef.current = true;
    }
  }, [inlineAreaName]);

  const refreshAfterAction = useCallback(async () => {
    await loadData();
    onTreeMutated?.();
  }, [loadData, onTreeMutated]);

  const startInlineAreaCreation = useCallback(() => {
    setIsRootOpen(true);
    setInlineAreaName('');
  }, []);

  const createAreaInline = useCallback(async () => {
    if (inlineAreaName === null) {
      return;
    }

    const name = inlineAreaName.trim();
    if (!name) {
      setInlineAreaName(null);
      return;
    }

    setIsInlineAreaSubmitting(true);
    try {
      await createArea(name);
      setInlineAreaName(null);
      await refreshAfterAction();
    } catch (err) {
      window.alert(getReadableError(err, 'Failed to create area.'));
    } finally {
      setIsInlineAreaSubmitting(false);
    }
  }, [inlineAreaName, refreshAfterAction]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    try {
      if (deleteTarget.kind === 'area') {
        await deleteArea(deleteTarget.id);
      } else {
        await deleteProject(deleteTarget.id);
        if (selectedProjectId === deleteTarget.id) {
          focusProject(null);
        }
      }
      setDeleteTarget(null);
      await refreshAfterAction();
    } catch (err) {
      window.alert(getReadableError(err, 'Delete action failed.'));
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, focusProject, refreshAfterAction, selectedProjectId]);

  const submitCreateProjectDialog = useCallback(async () => {
    if (!createProjectDialog) {
      return;
    }

    const name = createProjectDialog.name.trim();
    if (!name) {
      window.alert('Project name is required.');
      return;
    }

    const goal = createProjectDialog.goal.trim() || 'Focused progress';
    const primaryTask = createProjectDialog.primaryTask.trim();
    const notes = createProjectDialog.notes.trim();
    const rawHours = createProjectDialog.targetHours.trim();

    let targetHours: number | null = null;
    if (rawHours) {
      const parsed = Number.parseInt(rawHours, 10);
      if (Number.isNaN(parsed) || parsed < 0) {
        window.alert('Target hours must be a valid non-negative number.');
        return;
      }
      targetHours = parsed;
    }

    const payload: CreateProjectPayload = {
      areaId: createProjectDialog.areaId,
      name,
      goal,
      primaryTask: primaryTask || null,
      targetHours,
      notes: notes || null,
    };

    setIsCreateProjectSubmitting(true);
    try {
      await createProject(payload);
      setCreateProjectDialog(null);
      await refreshAfterAction();
    } catch (err) {
      window.alert(getReadableError(err, 'Failed to create project.'));
    } finally {
      setIsCreateProjectSubmitting(false);
    }
  }, [createProjectDialog, refreshAfterAction]);

  const submitActionDialog = useCallback(async () => {
    if (!actionDialog) {
      return;
    }

    const rawValue = actionDialog.value.trim();
    if (!rawValue) {
      window.alert('Value cannot be empty.');
      return;
    }

    setIsActionSubmitting(true);
    try {
      switch (actionDialog.mode) {
        case 'rename-area': {
          if (!actionDialog.areaId) {
            break;
          }

          await updateAreaName(actionDialog.areaId, rawValue);
          break;
        }
        case 'create-session': {
          if (!actionDialog.project) {
            break;
          }

          await startSession({
            projectId: actionDialog.project.id,
            title: rawValue,
            goal: actionDialog.project.goal || `Work on ${actionDialog.project.name}`,
          });
          break;
        }
        case 'edit-project-name':
        case 'edit-project-goal':
        case 'edit-project-task':
        case 'edit-project-hours': {
          if (!actionDialog.project) {
            break;
          }

          const payload: UpdateProjectPayload = {
            name: null,
            goal: null,
            primaryTask: null,
            targetHours: null,
            notes: null,
          };

          if (actionDialog.mode === 'edit-project-name') {
            payload.name = rawValue;
          } else if (actionDialog.mode === 'edit-project-goal') {
            payload.goal = rawValue;
          } else if (actionDialog.mode === 'edit-project-task') {
            payload.primaryTask = rawValue;
          } else {
            const parsed = Number.parseInt(rawValue, 10);
            if (Number.isNaN(parsed) || parsed < 0) {
              window.alert('Hours must be a valid non-negative number.');
              setIsActionSubmitting(false);
              return;
            }
            payload.targetHours = parsed;
          }

          await updateProject(actionDialog.project.id, payload);
          if (selectedProjectId === actionDialog.project.id) {
            focusProject({ ...actionDialog.project, ...payload } as ProjectDto);
          }
          break;
        }
      }

      setActionDialog(null);
      await refreshAfterAction();
    } catch (err) {
      window.alert(getReadableError(err, 'Action failed.'));
    } finally {
      setIsActionSubmitting(false);
    }
  }, [actionDialog, focusProject, refreshAfterAction, selectedProjectId]);

  return (
    <>
      <section className="supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border shadow-sm backdrop-blur-md">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Files</p>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-muted/25 p-3">
          {isLoading && (
            <div className="rounded-xl border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
              Loading areas and projects...
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-xl border border-destructive/40 bg-background/70 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <div className="rounded-xl border border-border bg-background/70 p-1.5">
              <Files
                className="w-full p-0"
                open={isRootOpen ? ['root-nexus'] : []}
                onOpenChange={(openValues) => {
                  setIsRootOpen(openValues.includes('root-nexus'));
                }}
              >
                <FolderItem value="root-nexus">
                  <ContextRowMenu
                    menu={
                      <>
                        <DropdownMenuLabel>Command Nexus</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => startInlineAreaCreation()}>
                          Добавить папку
                        </DropdownMenuItem>
                      </>
                    }
                  >
                    <button
                      type="button"
                      onClick={() => setIsRootOpen((previous) => !previous)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-semibold transition-colors hover:bg-accent/60"
                    >
                      <ChevronRight
                        className={cn(
                          'size-4 text-muted-foreground transition-transform',
                          isRootOpen && 'rotate-90',
                        )}
                      />
                      <FileIcon className="size-4" />
                      <span>Command Nexus</span>
                    </button>
                  </ContextRowMenu>

                  <FolderContent>
                    <div className="ml-1 mt-0 border-l border-border pl-0.5">
                      {inlineAreaName !== null && (
                        <div className="mb-1 flex items-center gap-2 rounded-md px-2 py-1.5">
                          <FolderIcon className="size-4 text-muted-foreground" />
                          <Input
                            ref={inlineAreaInputRef}
                            value={inlineAreaName}
                            onChange={(event) => setInlineAreaName(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                event.preventDefault();
                                void createAreaInline();
                              }
                              if (event.key === 'Escape') {
                                event.preventDefault();
                                setInlineAreaName(null);
                              }
                            }}
                            className="h-7 text-xs"
                            placeholder="Имя папки"
                            disabled={isInlineAreaSubmitting}
                          />
                        </div>
                      )}

                      {groupedAreas.length === 0 && inlineAreaName === null ? (
                        <div className="px-2 py-2 text-xs text-muted-foreground">
                          No areas yet. Right-click Command Nexus and add a folder.
                        </div>
                      ) : (
                        <Files
                          className="w-full p-0.5"
                          open={openAreaNodes}
                          onOpenChange={setOpenAreaNodes}
                        >
                          {groupedAreas.map((area) => (
                            <FolderItem key={area.id} value={`area-${area.id}`}>
                              <ContextRowMenu
                                menu={
                                  <>
                                    <DropdownMenuLabel>{area.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onSelect={() =>
                                        setCreateProjectDialog({
                                          areaId: area.id,
                                          areaName: area.name,
                                          name: '',
                                          goal: 'Focused progress',
                                          primaryTask: '',
                                          targetHours: '',
                                          notes: '',
                                        })
                                      }
                                    >
                                      Добавить проект
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onSelect={() =>
                                        setActionDialog({
                                          mode: 'rename-area',
                                          title: 'Переименовать папку',
                                          description: 'Укажи новое имя папки.',
                                          fieldLabel: 'Название папки',
                                          value: area.name,
                                          areaId: area.id,
                                        })
                                      }
                                    >
                                      Переименовать
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      variant="destructive"
                                      onSelect={() =>
                                        setDeleteTarget({
                                          kind: 'area',
                                          id: area.id,
                                          name: area.name,
                                        })
                                      }
                                    >
                                      Удалить
                                    </DropdownMenuItem>
                                  </>
                                }
                              >
                                <FolderTrigger>
                                  {area.name} ({area.projects.length})
                                </FolderTrigger>
                              </ContextRowMenu>

                              <FolderContent>
                                <SubFiles>
                                  {area.projects.length === 0 ? (
                                    <FileItem icon={FolderIcon}>No projects yet</FileItem>
                                  ) : (
                                    area.projects
                                      .slice()
                                      .sort((a, b) => a.name.localeCompare(b.name))
                                      .map((project) => (
                                        <ContextRowMenu
                                          key={project.id}
                                          onContextOpen={() => focusProject(project)}
                                          menu={
                                            <>
                                              <DropdownMenuLabel>{project.name}</DropdownMenuLabel>
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem
                                                onSelect={() =>
                                                  setActionDialog({
                                                    mode: 'create-session',
                                                    title: 'Создать сессию',
                                                    description: `Создание новой сессии для проекта "${project.name}".`,
                                                    fieldLabel: 'Название сессии',
                                                    value: `Сессия: ${project.name}`,
                                                    project,
                                                  })
                                                }
                                              >
                                                Создать сессию
                                              </DropdownMenuItem>
                                              <DropdownMenuItem onSelect={() => focusProject(project)}>
                                                Свойства
                                              </DropdownMenuItem>
                                              <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>
                                                  Редактировать
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuSubContent>
                                                  <DropdownMenuItem
                                                    onSelect={() =>
                                                      setActionDialog({
                                                        mode: 'edit-project-name',
                                                        title: 'Изменить название проекта',
                                                        description: 'Введи новое название.',
                                                        fieldLabel: 'Название',
                                                        value: project.name,
                                                        project,
                                                      })
                                                    }
                                                  >
                                                    Изменить название
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem
                                                    onSelect={() =>
                                                      setActionDialog({
                                                        mode: 'edit-project-goal',
                                                        title: 'Изменить цель проекта',
                                                        description: 'Обнови цель проекта.',
                                                        fieldLabel: 'Цель',
                                                        value: project.goal,
                                                        project,
                                                      })
                                                    }
                                                  >
                                                    Изменить цель
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem
                                                    onSelect={() =>
                                                      setActionDialog({
                                                        mode: 'edit-project-task',
                                                        title: 'Изменить задачу проекта',
                                                        description: 'Обнови основную задачу проекта.',
                                                        fieldLabel: 'Задача',
                                                        value: project.primaryTask ?? '',
                                                        project,
                                                      })
                                                    }
                                                  >
                                                    Изменить задачу
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem
                                                    onSelect={() =>
                                                      setActionDialog({
                                                        mode: 'edit-project-hours',
                                                        title: 'Изменить часы проекта',
                                                        description: 'Укажи целевое количество часов.',
                                                        fieldLabel: 'Часы',
                                                        value: project.targetHours?.toString() ?? '',
                                                        project,
                                                      })
                                                    }
                                                  >
                                                    Изменить часы
                                                  </DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                              </DropdownMenuSub>
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem
                                                variant="destructive"
                                                onSelect={() =>
                                                  setDeleteTarget({
                                                    kind: 'project',
                                                    id: project.id,
                                                    name: project.name,
                                                  })
                                                }
                                              >
                                                Удалить
                                              </DropdownMenuItem>
                                            </>
                                          }
                                        >
                                          <div
                                            onClick={() => focusProject(project)}
                                            className={cn(
                                              'rounded-md',
                                              selectedProjectId === project.id &&
                                                'bg-accent/50 ring-1 ring-border',
                                            )}
                                          >
                                            <FileItem icon={FileIcon}>{project.name}</FileItem>
                                          </div>
                                        </ContextRowMenu>
                                      ))
                                  )}
                                </SubFiles>
                              </FolderContent>
                            </FolderItem>
                          ))}
                        </Files>
                      )}
                    </div>
                  </FolderContent>
                </FolderItem>
              </Files>
            </div>
          )}
        </div>
      </section>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(openValue) => {
          if (!openValue && !isDeleting) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Удалить "${deleteTarget.name}"? Действие нельзя отменить.`
                : 'Delete item.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmDelete();
              }}
            >
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={createProjectDialog !== null}
        onOpenChange={(openValue) => {
          if (!openValue && !isCreateProjectSubmitting) {
            setCreateProjectDialog(null);
          }
        }}
      >
        <DialogContent
          showCloseButton={!isCreateProjectSubmitting}
          className="sm:max-w-[525px]"
        >
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              {createProjectDialog
                ? `New project in folder "${createProjectDialog.areaName}".`
                : 'Fill project details.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <label className="text-xs text-muted-foreground">Name</label>
              <Input
                value={createProjectDialog?.name ?? ''}
                onChange={(event) =>
                  setCreateProjectDialog((previous) =>
                    previous ? { ...previous, name: event.target.value } : previous,
                  )
                }
                placeholder="Project name"
                disabled={isCreateProjectSubmitting}
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs text-muted-foreground">Goal</label>
              <Input
                value={createProjectDialog?.goal ?? ''}
                onChange={(event) =>
                  setCreateProjectDialog((previous) =>
                    previous ? { ...previous, goal: event.target.value } : previous,
                  )
                }
                placeholder="Project goal"
                disabled={isCreateProjectSubmitting}
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs text-muted-foreground">Primary Task</label>
              <Input
                value={createProjectDialog?.primaryTask ?? ''}
                onChange={(event) =>
                  setCreateProjectDialog((previous) =>
                    previous ? { ...previous, primaryTask: event.target.value } : previous,
                  )
                }
                placeholder="Main task"
                disabled={isCreateProjectSubmitting}
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs text-muted-foreground">Target Hours</label>
              <Input
                value={createProjectDialog?.targetHours ?? ''}
                onChange={(event) =>
                  setCreateProjectDialog((previous) =>
                    previous ? { ...previous, targetHours: event.target.value } : previous,
                  )
                }
                type="number"
                min={0}
                placeholder="0"
                disabled={isCreateProjectSubmitting}
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs text-muted-foreground">Notes</label>
              <Input
                value={createProjectDialog?.notes ?? ''}
                onChange={(event) =>
                  setCreateProjectDialog((previous) =>
                    previous ? { ...previous, notes: event.target.value } : previous,
                  )
                }
                placeholder="Optional notes"
                disabled={isCreateProjectSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateProjectDialog(null)}
              disabled={isCreateProjectSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void submitCreateProjectDialog()}
              disabled={isCreateProjectSubmitting}
            >
              {isCreateProjectSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={actionDialog !== null}
        onOpenChange={(openValue) => {
          if (!openValue && !isActionSubmitting) {
            setActionDialog(null);
          }
        }}
      >
        <DialogContent showCloseButton={!isActionSubmitting} className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{actionDialog?.title}</DialogTitle>
            <DialogDescription>{actionDialog?.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <label className="text-xs text-muted-foreground">{actionDialog?.fieldLabel}</label>
            <Input
              value={actionDialog?.value ?? ''}
              onChange={(event) => {
                setActionDialog((previous) =>
                  previous
                    ? {
                        ...previous,
                        value: event.target.value,
                      }
                    : previous,
                );
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void submitActionDialog();
                }
              }}
              type={actionDialog?.mode === 'edit-project-hours' ? 'number' : 'text'}
              min={actionDialog?.mode === 'edit-project-hours' ? 0 : undefined}
              placeholder="Введите значение"
              disabled={isActionSubmitting}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setActionDialog(null)}
              disabled={isActionSubmitting}
            >
              Отмена
            </Button>
            <Button
              type="button"
              onClick={() => void submitActionDialog()}
              disabled={isActionSubmitting}
            >
              {isActionSubmitting ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
