import Link from "next/link";
import { ArrowRight, Globe2, Star, TrendingUp } from "lucide-react";
import { countryFlags } from "@/lib/mock-data";
import { ProgressBar } from "@/components/progress-bar";
import { SummaryCards } from "@/components/summary-cards";
import { computeAlbumStats } from "@/services/stickers";
import type { Sticker } from "@/types/sticker";
import { cn } from "@/lib/utils";

export function DashboardMain({
  stickers,
  userLabel,
}: {
  stickers: Sticker[];
  userLabel: string;
}) {
  const { owned, missing, duplicates, progress, countryStats, total } =
    computeAlbumStats(stickers);

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      <section aria-labelledby="greeting-heading">
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-md relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <svg className="absolute -right-8 -bottom-8 h-40 w-40 opacity-10" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="2" />
              <polygon points="50,10 60,30 40,30" fill="white" />
              <polygon points="90,50 70,40 70,60" fill="white" />
              <polygon points="50,90 40,70 60,70" fill="white" />
              <polygon points="10,50 30,60 30,40" fill="white" />
            </svg>
          </div>

          <div className="relative">
            <p className="text-sm font-medium text-primary-foreground/70">Bienvenido de vuelta,</p>
            <h1 id="greeting-heading" className="font-display text-2xl font-bold uppercase tracking-wide mt-0.5">
              {userLabel}
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Continúa — ¡estás al {progress.toFixed(0)}% completado!
            </p>

            <div className="mt-4 rounded-2xl bg-white/15 p-4">
              <ProgressBar value={progress} total={total} owned={owned} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Resumen del Álbum
        </h2>
        <SummaryCards total={total} owned={owned} missing={missing} duplicates={duplicates} />
      </section>

      <section aria-labelledby="actions-heading">
        <h2
          id="actions-heading"
          className="font-display text-base font-bold uppercase tracking-wider text-foreground mb-3"
        >
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/stickers"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Ver Todo</p>
              <p className="text-xs text-muted-foreground">Ver colección</p>
            </div>
          </Link>

          <Link
            href="/stickers?filter=missing"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Falta</p>
              <p className="text-xs text-muted-foreground">{missing} figuritas</p>
            </div>
          </Link>

          <Link
            href="/stickers?filter=duplicates"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all col-span-2 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Duplicados para Intercambiar</p>
              <p className="text-xs text-muted-foreground">
                {duplicates} figuritas disponibles para intercambio
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="countries-heading">
        <h2
          id="countries-heading"
          className="font-display text-base font-bold uppercase tracking-wider text-foreground mb-3"
        >
          Países
        </h2>
        <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border overflow-hidden">
          {countryStats.map(({ name, owned: cOwned, total: cTotal, pct, code }) => (
            <div
              key={name}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <span className="text-xl leading-none" aria-hidden="true">
                {countryFlags[code] ?? "🏳️"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground truncate">{name}</span>
                  <span className="text-xs font-medium text-muted-foreground ml-2 shrink-0">
                    {cOwned}/{cTotal}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      pct === 100 ? "bg-primary" : pct >= 60 ? "bg-accent" : "bg-muted-foreground/40"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span
                className={cn(
                  "text-xs font-bold w-8 text-right shrink-0",
                  pct === 100 ? "text-primary" : "text-muted-foreground"
                )}
              >
                {pct}%
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
