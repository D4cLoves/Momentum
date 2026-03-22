import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Timer, Sparkles, ListChecks } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LandingPage() {
  const navigate = useNavigate();

  const highlights = useMemo(
    () => [
      { icon: Timer, title: "Осознанное время", desc: "Сессии с таймером и заметками результата." },
      { icon: Sparkles, title: "Проекты вместо хаоса", desc: "Собирай учебу и навыки в измеримый прогресс." },
      { icon: ListChecks, title: "Микро-таски", desc: "Чек-лист прямо во время сессии." },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(1200px circle at 20% -10%, rgba(99,102,241,0.35), transparent 45%), radial-gradient(900px circle at 90% 20%, rgba(16,185,129,0.25), transparent 50%), radial-gradient(700px circle at 40% 90%, rgba(244,114,182,0.18), transparent 45%)",
          }}
        />

        <main className="relative mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full bg-white/5">
                  Momentum
                </Badge>
                <Badge variant="outline" className="rounded-full border-white/15 bg-white/5 text-foreground/90">
                  macOS Dark + glass
                </Badge>
              </div>

              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight lg:text-5xl">
                Время в голове, прогресс в цифрах.
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
                Веб-приложение для осознанного учета времени: превращай занятия в проекты, а сессии в
                результат. Все — для одного пользователя, чтобы тебе было удобно.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate("/auth/login")}
                  className="bg-primary/90 hover:bg-primary"
                >
                  Войти
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/auth/register")}
                  className="border-white/15 bg-white/5 hover:bg-white/10"
                >
                  Регистрация
                </Button>
              </div>

              <div className="mt-10 hidden lg:block">
                <Separator className="bg-white/10" />
                <div className="mt-6 grid gap-3">
                  <div className="text-sm text-muted-foreground">
                    Тебе понравится, если ты хочешь:
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="rounded-lg bg-white/5 px-3 py-2">видеть прогресс без лишних табличек</div>
                    <div className="rounded-lg bg-white/5 px-3 py-2">не потерять заметки и задачи</div>
                    <div className="rounded-lg bg-white/5 px-3 py-2">держать фокус во время таймера</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="rounded-3xl border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Как это устроено</div>
                    <div className="text-lg font-medium">4 уровня: Area → Project → Session → Task</div>
                  </div>
                  <div className="text-2xl">🎯</div>
                </div>

                <div className="mt-6 grid gap-4">
                  {highlights.map((h) => (
                    <div key={h.title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-4">
                      <h.icon className="mt-1 size-5 text-foreground/90" />
                      <div>
                        <div className="text-sm font-semibold">{h.title}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{h.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6 bg-white/10" />

                <div className="text-sm text-muted-foreground">
                  Запустишь таймер — и кабинет станет недоступным. Так проще не сбиваться во время работы.
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

