"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authEmailDomain =
    process.env.NEXT_PUBLIC_AUTH_EMAIL_DOMAIN?.trim().toLowerCase() || "album.local";

  function resolveLoginEmail(rawUsername: string) {
    const normalized = rawUsername.trim().toLowerCase();
    if (normalized.includes("@")) {
      return normalized;
    }
    return `${normalized}@${authEmailDomain}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const normalizedUsername = username.trim();
    if (!normalizedUsername || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const email = resolveLoginEmail(normalizedUsername);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
      return;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo conectar. Comprobá las variables NEXT_PUBLIC_SUPABASE_* en .env.local."
      );
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/5" />
        <div className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-accent/10" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/50">
            <Image
              src="/mundial_2026.png"
              alt="Mundial 2026"
              width={64}
              height={64}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold uppercase tracking-wider text-foreground">
              Album-Mundial<span className="text-accent">-26</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Administrador de álbum de figuritas - Mundial 2026
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
          <h2 className="mb-5 text-lg font-semibold text-foreground">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="ej: nancel"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={cn(
                  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none",
                  "placeholder:text-muted-foreground/60",
                  "focus:border-primary focus:ring-2 focus:ring-ring/30 transition-all"
                )}
              />
            </div>

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

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 border border-rose-100"
              >
                {error}
              </p>
            )}

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

          <p className="mt-4 text-center text-xs text-muted-foreground leading-relaxed">
            Las cuentas se crean manualmente, pedir al tío néstor que te cree una.
          </p>
        </div>

      </div>
    </main>
  );
}
