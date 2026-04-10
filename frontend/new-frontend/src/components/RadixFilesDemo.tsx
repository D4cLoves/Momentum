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

type ContextRowMenuProps = {
  children: ReactNode;
  menu: ReactNode;
  menuClassName?: string;
};

type DeleteTarget =
  | { kind: 'area'; id: string; name: string }
  | { kind: 'project'; id: string; name: string };

type ActionDialogMode =
  | 'add-project'
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

function ContextRowMenu({ children, menu, menuClassName }: ContextRowMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className="rounded-md"
          onPointerDown={(event) => {
            if (event.pointerType === 'mouse' && event.button === 0) {
              event.preventDefault();
            }
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            setIsOpen(true);
          }}
        >
          {children}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className={cn('w-56', menuClassName)}
      >
        {menu}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getReadableError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const RadixFilesDemo = () => {
  const [areas, setAreas] = useState<AreaDto[]>([]);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTreeOpen, setIsTreeOpen] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [actionDialog, setActionDialog] = useState<ActionDialogState | null>(null);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const [inlineAreaName, setInlineAreaName] = useState<string | null>(null);
  const [isInlineAreaSubmitting, setIsInlineAreaSubmitting] = useState(false);
  const inlineAreaInputRef = useRef<HTMLInputElement | null>(null);

  const [propertiesProject, setPropertiesProject] = useState<ProjectDto | null>(null);

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
    if (inlineAreaName === null) {
      return;
    }

    inlineAreaInputRef.current?.focus();
    inlineAreaInputRef.current?.select();
  }, [inlineAreaName]);

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

  const refreshAfterAction = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const openActionDialog = useCallback((state: ActionDialogState) => {
    setActionDialog(state);
  }, []);

  const startInlineAreaCreation = useCallback(() => {
    setIsTreeOpen(true);
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
      }
      setDeleteTarget(null);
      await refreshAfterAction();
    } catch (err) {
      window.alert(getReadableError(err, 'Delete action failed.'));
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, refreshAfterAction]);

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
        case 'add-project': {
          if (!actionDialog.areaId) {
            return;
          }

          await createProject({
            areaId: actionDialog.areaId,
            name: rawValue,
            goal: 'Focused progress',
            primaryTask: null,
            targetHours: null,
            notes: null,
          });
          break;
        }
        case 'rename-area': {
          if (!actionDialog.areaId) {
            return;
          }

          await updateAreaName(actionDialog.areaId, rawValue);
          break;
        }
        case 'create-session': {
          if (!actionDialog.project) {
            return;
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
            return;
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
  }, [actionDialog, refreshAfterAction]);

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
                open={isTreeOpen ? ['root-nexus'] : []}
                onOpenChange={(openValues) => {
                  setIsTreeOpen(openValues.includes('root-nexus'));
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
                      onClick={() => setIsTreeOpen((previous) => !previous)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-semibold transition-colors hover:bg-accent/60"
                    >
                      <ChevronRight
                        className={cn(
                          'size-4 text-muted-foreground transition-transform',
                          isTreeOpen && 'rotate-90',
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
                            onBlur={() => {
                              if (!isInlineAreaSubmitting) {
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
                        <Files className="w-full p-0.5" defaultOpen={[]}>
                          {groupedAreas.map((area) => (
                            <FolderItem key={area.id} value={`area-${area.id}`}>
                              <ContextRowMenu
                                menu={
                                  <>
                                    <DropdownMenuLabel>{area.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onSelect={() =>
                                        openActionDialog({
                                          mode: 'add-project',
                                          title: 'Добавить проект',
                                          description: `Новый проект будет создан в папке "${area.name}".`,
                                          fieldLabel: 'Название проекта',
                                          value: '',
                                          areaId: area.id,
                                        })
                                      }
                                    >
                                      Добавить проект
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onSelect={() =>
                                        openActionDialog({
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
                                          menu={
                                            <>
                                              <DropdownMenuLabel>{project.name}</DropdownMenuLabel>
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem
                                                onSelect={() =>
                                                  openActionDialog({
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
                                              <DropdownMenuItem
                                                onSelect={() => setPropertiesProject(project)}
                                              >
                                                Свойства
                                              </DropdownMenuItem>
                                              <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>
                                                  Редактировать
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuSubContent>
                                                  <DropdownMenuItem
                                                    onSelect={() =>
                                                      openActionDialog({
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
                                                      openActionDialog({
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
                                                      openActionDialog({
                                                        mode: 'edit-project-task',
                                                        title: 'Изменить основную задачу',
                                                        description: 'Обнови главную задачу проекта.',
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
                                                      openActionDialog({
                                                        mode: 'edit-project-hours',
                                                        title: 'Изменить целевые часы',
                                                        description: 'Укажи количество часов.',
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
                                          <FileItem icon={FileIcon}>{project.name}</FileItem>
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
                : 'Удаление элемента.'}
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
            <label className="text-xs text-muted-foreground">
              {actionDialog?.fieldLabel}
            </label>
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

      <Dialog
        open={propertiesProject !== null}
        onOpenChange={(openValue) => {
          if (!openValue) {
            setPropertiesProject(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Свойства проекта</DialogTitle>
            <DialogDescription>Текущие данные проекта.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 text-sm">
            <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
              <p className="text-xs text-muted-foreground">Название</p>
              <p className="mt-1 font-medium">{propertiesProject?.name}</p>
            </div>
            <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
              <p className="text-xs text-muted-foreground">Цель</p>
              <p className="mt-1 font-medium">{propertiesProject?.goal}</p>
            </div>
            <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
              <p className="text-xs text-muted-foreground">Основная задача</p>
              <p className="mt-1 font-medium">{propertiesProject?.primaryTask || 'Not set'}</p>
            </div>
            <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
              <p className="text-xs text-muted-foreground">Целевые часы</p>
              <p className="mt-1 font-medium">
                {propertiesProject?.targetHours !== null &&
                propertiesProject?.targetHours !== undefined
                  ? `${propertiesProject.targetHours}h`
                  : 'Not set'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPropertiesProject(null)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
