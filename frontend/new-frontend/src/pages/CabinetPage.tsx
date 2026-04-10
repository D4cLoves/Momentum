import React from "react"
import {
  HomeIcon,
  BarChart3,
  User2,
  Settings2,
  Clock3,
  Target,
  ListTodo,
  Activity,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dock, DockIcon } from "@/components/ui/dock"
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler"
import { RadixFilesDemo } from "@/components/RadixFilesDemo"

type IconProps = React.HTMLAttributes<SVGElement>

const Icons = {
  github: (props: IconProps) => (
    <svg viewBox="0 0 438.549 438.549" {...props}>
      <path
        fill="currentColor"
        d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
      />
    </svg>
  ),
}

const DATA = {
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/statistics", icon: BarChart3, label: "Statistics" },
    { href: "/account", icon: User2, label: "Account" },
    { href: "/settings", icon: Settings2, label: "Settings" },
  ],
  contact: {
    social: {
      GitHub: { name: "GitHub", url: "#", icon: Icons.github },
    },
  },
}

const projectPreview = {
  name: "Momentum Client Redesign",
  area: "Command Center / yaya",
  goal: "Собрать удобный рабочий кабинет с чистым UX и быстрыми действиями по проектам.",
  primaryTask: "Связать project explorer с диалогами и CRUD.",
  targetHours: 24,
  spentHours: 9.5,
  completion: 40,
}

const recentSessions = [
  { id: "s1", title: "Проектные диалоги", duration: "1ч 34м", startedAt: "Сегодня, 11:20", status: "Завершена" },
  { id: "s2", title: "Контекстные меню", duration: "57м", startedAt: "Сегодня, 09:40", status: "Завершена" },
  { id: "s3", title: "Выравнивание layout", duration: "42м", startedAt: "Вчера, 19:10", status: "Завершена" },
  { id: "s4", title: "Стили инпутов", duration: "31м", startedAt: "Вчера, 17:35", status: "Завершена" },
]

function DockDemo() {
  return (
    <div className="flex flex-col items-center justify-center">
      <TooltipProvider>
        <Dock
          direction="middle"
          iconSize={46}
          iconMagnification={66}
          iconDistance={155}
          className="h-[72px] gap-2.5 px-2.5"
        >
          {DATA.navbar.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-[3rem] rounded-full"
                    )}
                  >
                    <item.icon className="size-[18px]" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

          <Separator orientation="vertical" className="h-full" />

          {Object.entries(DATA.contact.social).map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={social.url}
                    aria-label={social.name}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-[3rem] rounded-full"
                    )}
                  >
                    <social.icon className="size-[18px]" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

          <Separator orientation="vertical" className="h-full" />

          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <ThemeTogglerButton
                  variant="ghost"
                  size="sm"
                  direction="ltr"
                  modes={['light', 'dark']}
                  aria-label="Toggle theme"
                  className="size-[3rem] rounded-full"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Theme</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </TooltipProvider>
    </div>
  )
}

export function CabinetPage() {
  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className="pointer-events-none fixed inset-x-0 bottom-[18px] z-50 flex justify-center px-4">
        <div className="pointer-events-auto">
          <DockDemo />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden pl-4 pr-2 pb-[40px] pt-4">
        <div className="h-full w-full">
          <div className="flex h-full min-h-0 gap-4">
            <div className="flex h-full w-[min(340px,26vw)] min-w-[240px] flex-none flex-col gap-4">
              <section className="supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 flex h-[390px] flex-none flex-col rounded-2xl border shadow-sm backdrop-blur-md">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-center text-sm font-semibold">Focus Summary</p>
                </div>

                <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4 p-4">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/25 px-3 py-2.5">
                    <div className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold">
                      VL
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">Привет, Влад</p>
                      <p className="truncate text-xs text-muted-foreground">Поехали делать фокус.</p>
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-col items-center justify-center rounded-xl border border-border bg-muted/40 px-3 py-4 text-center">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Фокус за сегодня</p>
                    <p className="mt-2 text-[clamp(32px,3.4vw,52px)] font-semibold leading-none [font-variant-numeric:tabular-nums]">1ч 34м</p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/25 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">Streak</p>
                    <p className="text-sm font-medium">4 days</p>
                  </div>
                </div>
              </section>

              <div className="min-h-0 flex-1">
                <RadixFilesDemo />
              </div>
            </div>

            <section className="supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-sm backdrop-blur-md">
              <div className="border-b border-border px-5 py-4">
                <p className="text-sm font-semibold">Project Workspace</p>
              </div>

              <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr] gap-4 p-4">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
                  <article className="rounded-xl border border-border bg-muted/25 p-4">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Активный проект</p>
                    <h3 className="mt-1 text-lg font-semibold">{projectPreview.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{projectPreview.area}</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{projectPreview.goal}</p>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                        <p className="text-[11px] text-muted-foreground">Главная задача</p>
                        <p className="mt-1 text-sm font-medium">{projectPreview.primaryTask}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                        <p className="text-[11px] text-muted-foreground">Прогресс</p>
                        <p className="mt-1 text-sm font-medium">{projectPreview.completion}%</p>
                      </div>
                    </div>
                  </article>

                  <article className="rounded-xl border border-border bg-muted/25 p-4">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Сводка</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between rounded-lg border border-border bg-background/70 px-3 py-2">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-3.5" />План часов</span>
                        <span className="text-sm font-medium">{projectPreview.targetHours}h</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border bg-background/70 px-3 py-2">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground"><Activity className="size-3.5" />Потрачено</span>
                        <span className="text-sm font-medium">{projectPreview.spentHours}h</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border bg-background/70 px-3 py-2">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground"><Target className="size-3.5" />Осталось</span>
                        <span className="text-sm font-medium">{projectPreview.targetHours - projectPreview.spentHours}h</span>
                      </div>
                    </div>
                  </article>
                </div>

                <article className="flex min-h-0 flex-col rounded-xl border border-border bg-muted/25">
                  <div className="border-b border-border px-4 py-3">
                    <p className="flex items-center gap-2 text-sm font-semibold"><ListTodo className="size-4" />История сессий</p>
                  </div>

                  <div className="min-h-0 flex-1 overflow-auto p-3">
                    <div className="space-y-2">
                      {recentSessions.map((session) => (
                        <div key={session.id} className="grid gap-2 rounded-lg border border-border bg-background/75 px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{session.title}</p>
                            <p className="text-xs text-muted-foreground">{session.startedAt}</p>
                          </div>
                          <p className="text-xs text-muted-foreground sm:self-center">{session.duration}</p>
                          <p className="text-xs font-medium sm:self-center">{session.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
