'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileIcon, FolderIcon } from 'lucide-react';
import {
  FileItem,
  Files,
  FolderContent,
  FolderItem,
  FolderTrigger,
  SubFiles,
} from '@/components/animate-ui/components/radix/files';
import { getAreas, getProjects, type AreaDto, type ProjectDto } from '@/api/cabinetApi';

type AreaWithProjects = AreaDto & { projects: ProjectDto[] };

export const RadixFilesDemo = () => {
  const [areas, setAreas] = useState<AreaDto[]>([]);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [loadedAreas, loadedProjects] = await Promise.all([
          getAreas(),
          getProjects(),
        ]);

        if (!isMounted) {
          return;
        }

        setAreas(loadedAreas);
        setProjects(loadedProjects);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const message =
          err instanceof Error ? err.message : 'Failed to load areas and projects.';
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

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

        {!isLoading && !error && groupedAreas.length === 0 && (
          <div className="rounded-xl border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
            No areas yet. Create an area and projects will appear here.
          </div>
        )}

        {!isLoading && !error && groupedAreas.length > 0 && (
          <div className="rounded-xl border border-border bg-background/70 p-1.5">
            <Files className="w-full" defaultOpen={defaultOpen}>
              {groupedAreas.map((area) => (
                <FolderItem key={area.id} value={`area-${area.id}`}>
                  <FolderTrigger>
                    {area.name} ({area.projects.length})
                  </FolderTrigger>

                  <FolderContent>
                    <SubFiles>
                      {area.projects.length === 0 ? (
                        <FileItem icon={FolderIcon}>No projects yet</FileItem>
                      ) : (
                        area.projects
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((project) => (
                            <FileItem key={project.id} icon={FileIcon}>
                              {project.name}
                            </FileItem>
                          ))
                      )}
                    </SubFiles>
                  </FolderContent>
                </FolderItem>
              ))}
            </Files>
          </div>
        )}
      </div>
    </section>
  );
};
