'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
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
import { cn } from '@/lib/utils';

type AreaWithProjects = AreaDto & { projects: ProjectDto[] };

type ContextRowMenuProps = {
  children: ReactNode;
  menu: ReactNode;
  menuClassName?: string;
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

  const defaultOpen = groupedAreas[0] ? [`area-${groupedAreas[0].id}`] : [];

  const refreshAfterAction = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const handleAddArea = useCallback(async () => {
    const input = window.prompt('Название папки (area):', 'Новая папка');
    if (input === null) {
      return;
    }

    const name = input.trim();
    if (!name) {
      window.alert('Название папки не может быть пустым.');
      return;
    }

    try {
      await createArea(name);
      await refreshAfterAction();
    } catch (err) {
      window.alert(getReadableError(err, 'Failed to create area.'));
    }
  }, [refreshAfterAction]);

  const handleAddProject = useCallback(
    async (area: AreaDto) => {
      const nameInput = window.prompt('Название проекта:', 'Новый проект');
      if (nameInput === null) {
        return;
      }

      const name = nameInput.trim();
      if (!name) {
        window.alert('Название проекта не может быть пустым.');
        return;
      }

      const goalInput = window.prompt('Цель проекта:', 'Сфокусированный прогресс');
      if (goalInput === null) {
        return;
      }

      const goal = goalInput.trim() || 'Сфокусированный прогресс';

      try {
        await createProject({
          areaId: area.id,
          name,
          goal,
          primaryTask: null,
          targetHours: null,
          notes: null,
        });
        await refreshAfterAction();
      } catch (err) {
        window.alert(getReadableError(err, 'Failed to create project.'));
      }
    },
    [refreshAfterAction],
  );

  const handleRenameArea = useCallback(
    async (area: AreaDto) => {
      const input = window.prompt('Новое имя папки:', area.name);
      if (input === null) {
        return;
      }

      const name = input.trim();
      if (!name) {
        window.alert('Название папки не может быть пустым.');
        return;
      }

      try {
        await updateAreaName(area.id, name);
        await refreshAfterAction();
      } catch (err) {
        window.alert(getReadableError(err, 'Failed to rename area.'));
      }
    },
    [refreshAfterAction],
  );

  const handleDeleteArea = useCallback(
    async (area: AreaDto) => {
      const isConfirmed = window.confirm(
        `Удалить папку "${area.name}" вместе с проектами?`,
      );
      if (!isConfirmed) {
        return;
      }

      try {
        await deleteArea(area.id);
        await refreshAfterAction();
      } catch (err) {
        window.alert(getReadableError(err, 'Failed to delete area.'));
      }
    },
    [refreshAfterAction],
  );

  const patchProject = useCallback(
    async (projectId: string, payload: UpdateProjectPayload) => {
      try {
        await updateProject(projectId, payload);
        await refreshAfterAction();
      } catch (err) {
        window.alert(getReadableError(err, 'Failed to update project.'));
      }
    },
    [refreshAfterAction],
  );

  const handleCreateSession = useCallback(
    async (project: ProjectDto) => {
      const titleInput = window.prompt(
        'Название сессии:',
        `Сессия: ${project.name}`,
      );
      if (titleInput === null) {
        return;
      }

      const goalInput = window.prompt(
        'Цель сессии:',
        project.goal || `Работа над ${project.name}`,
      );
      if (goalInput === null) {
        return;
      }

      const title = titleInput.trim() || `Сессия: ${project.name}`;
      const goal = goalInput.trim() || project.goal || `Работа над ${project.name}`;

      try {
        await startSession({
          projectId: project.id,
          title,
          goal,
        });
        await refreshAfterAction();
      } catch (err) {
        window.alert(getReadableError(err, 'Failed to create session.'));
      }
    },
    [refreshAfterAction],
  );

  const handleShowProperties = useCallback((project: ProjectDto) => {
    const hours =
      project.targetHours === null ? 'Not set' : `${project.targetHours}h`;
    const primaryTask = project.primaryTask || 'Not set';
    const notes = project.notes || 'No notes';

    window.alert(
      [
        `Project: ${project.name}`,
        `Goal: ${project.goal}`,
        `Primary task: ${primaryTask}`,
        `Target hours: ${hours}`,
        `Notes: ${notes}`,
      ].join('\n'),
    );
  }, []);

  const handleDeleteProject = useCallback(
    async (project: ProjectDto) => {
      const isConfirmed = window.confirm(`Удалить проект "${project.name}"?`);
      if (!isConfirmed) {
        return;
      }

      try {
        await deleteProject(project.id);
        await refreshAfterAction();
      } catch (err) {
        window.alert(getReadableError(err, 'Failed to delete project.'));
      }
    },
    [refreshAfterAction],
  );

  const handleEditProjectName = useCallback(
    async (project: ProjectDto) => {
      const input = window.prompt('Новое название проекта:', project.name);
      if (input === null) {
        return;
      }

      const value = input.trim();
      if (!value) {
        window.alert('Название проекта не может быть пустым.');
        return;
      }

      await patchProject(project.id, {
        name: value,
        goal: null,
        primaryTask: null,
        targetHours: null,
        notes: null,
      });
    },
    [patchProject],
  );

  const handleEditProjectGoal = useCallback(
    async (project: ProjectDto) => {
      const input = window.prompt('Новая цель проекта:', project.goal);
      if (input === null) {
        return;
      }

      const value = input.trim();
      if (!value) {
        window.alert('Цель проекта не может быть пустой.');
        return;
      }

      await patchProject(project.id, {
        name: null,
        goal: value,
        primaryTask: null,
        targetHours: null,
        notes: null,
      });
    },
    [patchProject],
  );

  const handleEditProjectTask = useCallback(
    async (project: ProjectDto) => {
      const input = window.prompt(
        'Новая основная задача:',
        project.primaryTask || 'Новая задача',
      );
      if (input === null) {
        return;
      }

      const value = input.trim();
      if (!value) {
        window.alert('Основная задача не может быть пустой.');
        return;
      }

      await patchProject(project.id, {
        name: null,
        goal: null,
        primaryTask: value,
        targetHours: null,
        notes: null,
      });
    },
    [patchProject],
  );

  const handleEditProjectHours = useCallback(
    async (project: ProjectDto) => {
      const input = window.prompt(
        'Новые целевые часы:',
        project.targetHours?.toString() || '8',
      );
      if (input === null) {
        return;
      }

      const parsed = Number.parseInt(input.trim(), 10);
      if (Number.isNaN(parsed) || parsed < 0) {
        window.alert('Введи корректное число часов.');
        return;
      }

      await patchProject(project.id, {
        name: null,
        goal: null,
        primaryTask: null,
        targetHours: parsed,
        notes: null,
      });
    },
    [patchProject],
  );

  return (
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
            <ContextRowMenu
              menu={
                <>
                  <DropdownMenuLabel>Command Nexus</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => void handleAddArea()}>
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

            {isTreeOpen && (
              <div className="ml-1 mt-0 border-l border-border pl-0.5">
                {groupedAreas.length === 0 ? (
                  <div className="px-2 py-2 text-xs text-muted-foreground">
                    No areas yet. Right-click Command Nexus and add a folder.
                  </div>
                ) : (
                  <Files className="w-full p-0.5" defaultOpen={defaultOpen}>
                    {groupedAreas.map((area) => (
                      <FolderItem key={area.id} value={`area-${area.id}`}>
                        <ContextRowMenu
                          menu={
                            <>
                              <DropdownMenuLabel>{area.name}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={() => void handleAddProject(area)}>
                                Добавить проект
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => void handleRenameArea(area)}>
                                Переименовать
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => void handleDeleteArea(area)}
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
                                          onSelect={() => void handleCreateSession(project)}
                                        >
                                          Создать сессию
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onSelect={() => handleShowProperties(project)}
                                        >
                                          Свойства
                                        </DropdownMenuItem>
                                        <DropdownMenuSub>
                                          <DropdownMenuSubTrigger>
                                            Редактировать
                                          </DropdownMenuSubTrigger>
                                          <DropdownMenuSubContent>
                                            <DropdownMenuItem
                                              onSelect={() => void handleEditProjectName(project)}
                                            >
                                              Изменить название
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onSelect={() => void handleEditProjectGoal(project)}
                                            >
                                              Изменить цель
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onSelect={() => void handleEditProjectTask(project)}
                                            >
                                              Изменить задачу
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onSelect={() => void handleEditProjectHours(project)}
                                            >
                                              Изменить часы
                                            </DropdownMenuItem>
                                          </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          variant="destructive"
                                          onSelect={() => void handleDeleteProject(project)}
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
            )}
          </div>
        )}
      </div>
    </section>
  );
};
