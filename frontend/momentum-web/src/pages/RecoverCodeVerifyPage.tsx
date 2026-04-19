import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, CheckCircle2, KeyRound, ShieldCheck } from "lucide-react"

import { verifyResetCode } from "@/api/authApi"
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

export function RecoverCodeVerifyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const email = useMemo(() => searchParams.get("email") ?? "", [searchParams])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess(false)

    if (!email.trim()) {
      setError("Email is missing. Return to the previous step and request a new code.")
      return
    }

    const normalized = code.trim()
    if (normalized.length !== 6) {
      setError("Code must contain exactly 6 characters.")
      return
    }

    setLoading(true)
    try {
      const response = await verifyResetCode({
        email: email.trim(),
        code: normalized,
      })

      sessionStorage.setItem("pwdreset:sessionToken", response.sessionToken)
      sessionStorage.setItem("pwdreset:email", email.trim())
      setSuccess(true)
      setTimeout(() => navigate("/recover-code/reset"), 450)
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Failed to verify recovery code."
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
                  Enter the code
                  <br />
                  from your email.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  We sent a one-time reset code{email ? ` to ${email}` : ""}. Enter it to continue password recovery.
                </p>
              </div>
            </div>
          </article>

          <article className={`${framePanel} flex min-h-0 flex-col p-6 sm:p-8`}>
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Verify recovery code
                </p>
                <h2 className="mt-2 text-2xl font-semibold">6-digit code</h2>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-background/42">
                <KeyRound className="size-5 text-primary" />
              </div>
            </div>

            <form className="mt-6 flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground/95">
                  Code
                </span>
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="h-12 rounded-2xl border-border/80 bg-background/54 px-4 text-center text-lg tracking-[0.28em]"
                  placeholder="000000"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\s+/g, ""))}
                  maxLength={6}
                  required
                />
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="mt-5 h-12 w-full rounded-2xl text-sm font-semibold"
              >
                {loading ? "Verifying..." : "Verify code"}
              </Button>

              {success ? (
                <p className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600">
                  Code accepted. Recovery session created. Next step: set a new password.
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
                    If the code does not arrive, check spam and request a new code from the previous step.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button asChild variant="ghost" className="h-10 rounded-xl px-0 justify-start">
                    <Link to="/recover-code">
                      <ArrowLeft className="mr-2 size-4" />
                      Back to email
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
