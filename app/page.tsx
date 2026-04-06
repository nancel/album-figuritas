"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/5" />
        <div className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-accent/10" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Brand mark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Trophy className="h-8 w-8" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold uppercase tracking-wider text-foreground">
              Album-Mundial<span className="text-accent">26</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Administrador de álbum de figuritas - Mundial 2026</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
          <h2 className="mb-5 text-lg font-semibold text-foreground">Inicia sesión en tu álbum</h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none",
                  "placeholder:text-muted-foreground/60",
                  "focus:border-primary focus:ring-2 focus:ring-ring/30 transition-all"
                )}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 pr-10 text-sm outline-none",
                    "placeholder:text-muted-foreground/60",
                    "focus:border-primary focus:ring-2 focus:ring-ring/30 transition-all"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 border border-rose-100">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5",
                "text-sm font-semibold text-primary-foreground shadow-sm",
                "hover:bg-primary/90 active:scale-[0.98] transition-all duration-150",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Iniciando sesión…" : "Iniciar Sesión"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo: cualquier correo y contraseña funciona.
          </p>
        </div>
      </div>
    </main>
  );
}
