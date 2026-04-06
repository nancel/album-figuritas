"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { mockStickers, type Sticker } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { StickerGrid } from "@/components/sticker-grid";
import { cn } from "@/lib/utils";

type Filter = "all" | "owned" | "missing" | "duplicates";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all",        label: "Todos"      },
  { value: "owned",      label: "Tengo"      },
  { value: "missing",    label: "Falta"      },
  { value: "duplicates", label: "Duplicados" },
];

export default function StickersPage() {
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get("filter") as Filter) ?? "all";

  const [stickers, setStickers]   = useState<Sticker[]>(mockStickers);
  const [activeFilter, setFilter] = useState<Filter>(initialFilter);
  const [search, setSearch]       = useState("");

  // Keep filter in sync if navigated via URL (e.g. from dashboard quick actions)
  useEffect(() => {
    const f = searchParams.get("filter") as Filter | null;
    if (f && FILTERS.some((x) => x.value === f)) setFilter(f);
  }, [searchParams]);

  function increment(id: string) {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, quantity: s.quantity + 1 } : s))
    );
  }

  function decrement(id: string) {
    setStickers((prev) =>
      prev.map((s) =>
        s.id === id && s.quantity > 0 ? { ...s, quantity: s.quantity - 1 } : s
      )
    );
  }

  const filtered = useMemo(() => {
    let list = stickers;
    if (activeFilter === "owned")      list = list.filter((s) => s.quantity >= 1);
    if (activeFilter === "missing")    list = list.filter((s) => s.quantity === 0);
    if (activeFilter === "duplicates") list = list.filter((s) => s.quantity > 1);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.playerName.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q)
      );
    }
    return list;
  }, [stickers, activeFilter, search]);

  // Stats for chips
  const counts = useMemo(() => ({
    all:        stickers.length,
    owned:      stickers.filter((s) => s.quantity >= 1).length,
    missing:    stickers.filter((s) => s.quantity === 0).length,
    duplicates: stickers.filter((s) => s.quantity > 1).length,
  }), [stickers]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        {/* Page heading */}
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
            Mi Colección
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Toca + / − para actualizar tus figuritas
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Busca jugador, país o código…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full rounded-xl border border-input bg-card pl-10 pr-10 py-2.5 text-sm",
              "placeholder:text-muted-foreground/60 outline-none",
              "focus:border-primary focus:ring-2 focus:ring-ring/30 transition-all"
            )}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          role="tablist"
          aria-label="Filtrar figuritas"
        >
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              role="tab"
              aria-selected={activeFilter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
                activeFilter === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
                  activeFilter === value
                    ? "bg-white/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {counts[value]}
              </span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground">
          Mostrando{" "}
          <strong className="text-foreground">{filtered.length}</strong>{" "}
          figurita{filtered.length !== 1 && "s"}
        </p>

        {/* Grid */}
        <StickerGrid
          stickers={filtered}
          onIncrement={increment}
          onDecrement={decrement}
        />
      </main>
    </div>
  );
}
