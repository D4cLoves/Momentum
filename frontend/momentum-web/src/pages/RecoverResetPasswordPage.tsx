import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react"

import { resetPassword } from "@/api/authApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const framePanel =
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 rounded-[28px] border border-border/70 bg-background/32 shadow-[inset_0_1px_0_hsl(var(--background)/0.7),0_24px_70px_hsl(var(--foreground)/0.16)] backdrop-blur-xl"

const softCard =
  "rounded-2xl border border-border/70 bg-background/24 shadow-[inset_0_1px_0_hsl(var(--background)/0.55)] backdrop-blur-md"

const trafficDots = [
  "bg-[#ff5f57]",
  "bg-[#febc2e]",
  "bg-[#28c840]",
]

export function RecoverResetPasswordPage() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess(false)

    const sessionToken = sessionStorage.getItem("pwdreset:sessionToken") ?? ""
    if (!sessionToken) {
      setError("Recovery session is missing. Start again from email confirmation.")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      await resetPassword({
        sessionToken,
        newPassword,
      })

      sessionStorage.removeItem("pwdreset:sessionToken")
      sessionStorage.removeItem("pwdreset:email")

      setSuccess(true)
      setTimeout(() => navigate("/login", { replace: true }), 700)
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Failed to reset password."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,hsl(var(--primary)/0.16),transparent_25%),radial-gradient(circle_at_88%_10%,hsl(var(--primary)/0.1),transparent_20%),radial-gradient(circle_at_50%_100%,hsl(var(--primary)/0.08),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-[6.5%] w-px bg-gradient-to-b from-transparent via-border/40 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-[6.5%] w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative z-10 flex min-h-screen flex-col p-4 sm:p-5 lg:p-6">
        <div className="grid flex-1 min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(430px,0.9fr)]">
          <article className={`${framePanel} grid min-h-0 grid-rows-[auto_1fr] p-6 sm:p-8`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {trafficDots.map((item) => (
                  <span
                    key={item}
                    className={`size-2.5 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.08)] ${item}`}
                  />
                ))}
              </div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Recovery flow
              </p>
            </div>

            <div className="flex min-h-0 flex-col justify-center pt-8">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Password reset
                </p>
                <h1 className="mt-3 text-4xl font-semibold leading-[0.94] tracking-[-0.045em] sm:text-5xl xl:text-[5rem]">
                  Set a new password
                  <br />
                  for your account.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Use a strong password that you have not used before. Confirm it in the second field.
                </p>
              </div>
            </div>
          </article>

          <article className={`${framePanel} flex min-h-0 flex-col p-6 sm:p-8`}>
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  New credentials
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Choose a password</h2>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-background/42">
                <LockKeyhole className="size-5 text-primary" />
              </div>
            </div>

            <form className="mt-6 flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <label className="grid gap-2">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground/95">
                    New password
                  </span>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    className="h-12 rounded-2xl border-border/75 bg-background/60 px-4"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground/95">
                    Confirm password
                  </span>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    className="h-12 rounded-2xl border-border/75 bg-background/60 px-4"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat new password"
                    required
                  />
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-5 h-12 w-full rounded-2xl text-sm font-semibold"
              >
                {loading ? "Saving..." : "Save new password"}
              </Button>

              {success ? (
                <p className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600">
                  Password changed successfully. Redirecting to login...
                </p>
              ) : null}

              {error ? (
                <p className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <div className="mt-auto space-y-4 pt-6">
                <div className={`${softCard} flex items-start gap-3 px-4 py-4 text-sm text-muted-foreground`}>
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p>
                    Your recovery session token is stored in the current browser session only.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button asChild variant="ghost" className="h-10 rounded-xl px-0 justify-start">
                    <Link to="/recover-code/verify">
                      <ArrowLeft className="mr-2 size-4" />
                      Back to code
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 rounded-xl justify-start"
                    onClick={() => navigate("/login")}
                  >
                    <CheckCircle2 className="mr-2 size-4" />
                    Go to login
                  </Button>
                </div>
              </div>
            </form>
          </article>
        </div>
      </div>
    </section>
  )
}
