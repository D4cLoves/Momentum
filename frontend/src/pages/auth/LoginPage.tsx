import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

import { login, type LoginRequest } from "@/shared/api/momentum";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage({
  onAuthSuccess,
}: {
  onAuthSuccess: () => Promise<void>;
}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    setIsSubmitting(true);
    setError(null);
    try {
      const body: LoginRequest = { email, password };
      await login(body);
      await onAuthSuccess();
      navigate("/app");
    } catch (e) {
      setError("Не получилось войти. Проверь почту/пароль.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-14">
        <div className="space-y-2">
          <div className="text-2xl font-semibold">Momentum</div>
          <div className="text-sm text-muted-foreground">Вход в личный кабинет</div>
        </div>

        <Card className="rounded-3xl border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4">
            <label className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" />
                Почта
              </div>
              <Input
                value={email}
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="size-4" />
                Пароль
              </div>
              <Input
                value={password}
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="button"
              disabled={isSubmitting || email.trim().length === 0 || password.trim().length === 0}
              onClick={submit}
              className="rounded-xl"
            >
              {isSubmitting ? "Вход..." : "Войти"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Нет аккаунта?{" "}
              <button
                type="button"
                className="text-primary underline underline-offset-4"
                onClick={() => navigate("/auth/register")}
              >
                Регистрация
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

