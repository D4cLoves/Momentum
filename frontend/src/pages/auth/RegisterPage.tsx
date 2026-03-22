import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, UserRoundKey, Lock } from "lucide-react";

import { register, type RegisterRequest } from "@/shared/api/momentum";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    setIsSubmitting(true);
    setError(null);
    try {
      const body: RegisterRequest = { name, email, password };
      await register(body);
      navigate("/auth/login");
    } catch {
      setError("Не получилось создать аккаунт. Проверь данные.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-14">
        <div className="space-y-2">
          <div className="text-2xl font-semibold">Momentum</div>
          <div className="text-sm text-muted-foreground">Создание аккаунта</div>
        </div>

        <Card className="rounded-3xl border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4">
            <label className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserRoundKey className="size-4" />
                Имя
              </div>
              <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </label>

            <label className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" />
                Почта
              </div>
              <Input
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="button"
              disabled={
                isSubmitting || name.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0
              }
              onClick={submit}
              className="rounded-xl"
            >
              {isSubmitting ? "Создаю..." : "Регистрация"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <button
                type="button"
                className="text-primary underline underline-offset-4"
                onClick={() => navigate("/auth/login")}
              >
                Войти
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

