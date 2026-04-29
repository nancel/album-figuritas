"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import type { Sticker } from "@/types/sticker";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/navbar";
import { StickerGrid } from "@/components/sticker-grid";
import { cn } from "@/lib/utils";

type Filter = "all" | "owned" | "missing" | "duplicates";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "owned", label: "Tengo" },
  { value: "missing", label: "Falta" },
  { value: "duplicates", label: "Duplicados" },
];

export default function StickersClient({
  initialStickers,
  albumId,
  albumTitle,
}: {
  initialStickers: Sticker[];
  albumId: string;
  albumTitle?: string | null;
}) {
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get("filter") as Filter) ?? "all";

  const [stickers, setStickers] = useState<Sticker[]>(initialStickers);
  const [activeFilter, setFilter] = useState<Filter>(initialFilter);
  const [search, setSearch] = useState("");
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    setStickers(initialStickers);
  }, [initialStickers]);

  useEffect(() => {
    const f = searchParams.get("filter") as Filter | null;
    if (f && FILTERS.some((x) => x.value === f)) setFilter(f);
  }, [searchParams]);

  const persistIncrement = useCallback(
    async (id: string) => {
      setSyncError(null);
      const supabase = createBrowserSupabaseClient();

      const { data: row, error: readErr } = await supabase
        .from("album_sticker_quantities")
        .select("quantity")
        .eq("album_id", albumId)
        .eq("sticker_id", id)
        .maybeSingle();

      if (readErr) {
        setSyncError(readErr.message);
        return;
      }

      const currentQty = row?.quantity ?? 0;

      if (currentQty === 0) {
        const { error } = await supabase.from("album_sticker_quantities").insert({
          album_id: albumId,
          sticker_id: id,
          quantity: 1,
        });
        if (error) {
          if (error.code === "23505") {
            const { data: again } = await supabase
              .from("album_sticker_quantities")
              .select("quantity")
              .eq("album_id", albumId)
              .eq("sticker_id", id)
              .maybeSingle();
            const q = (again?.quantity ?? 0) + 1;
            const { error: upErr } = await supabase
              .from("album_sticker_quantities")
              .update({ quantity: q })
              .eq("album_id", albumId)
              .eq("sticker_id", id);
            if (upErr) {
              setSyncError(upErr.message);
              return;
            }
            setStickers((prev) =>
              prev.map((s) => (s.id === id ? { ...s, quantity: q } : s))
            );
            return;
          }
          setSyncError(error.message);
          return;
        }
        setStickers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, quantity: 1 } : s))
        );
        return;
      }

      const next = currentQty + 1;
      const { error } = await supabase
        .from("album_sticker_quantities")
        .update({ quantity: next })
        .eq("album_id", albumId)
        .eq("sticker_id", id);

      if (error) {
        setSyncError(error.message);
        return;
      }
      setStickers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, quantity: next } : s))
      );
    },
    [albumId]
  );

  const persistDecrement = useCallback(
    async (id: string) => {
      setSyncError(null);
      const supabase = createBrowserSupabaseClient();

      const { data: row, error: readErr } = await supabase
        .from("album_sticker_quantities")
        .select("quantity")
        .eq("album_id", albumId)
        .eq("sticker_id", id)
        .maybeSingle();

      if (readErr) {
        setSyncError(readErr.message);
        return;
      }

      const currentQty = row?.quantity ?? 0;
      if (currentQty <= 0) return;

      if (currentQty === 1) {
        const { error } = await supabase
          .from("album_sticker_quantities")
          .delete()
          .eq("album_id", albumId)
          .eq("sticker_id", id);

        if (error) {
          setSyncError(error.message);
          return;
        }
        setStickers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, quantity: 0 } : s))
        );
        return;
      }

      const next = currentQty - 1;
      const { error } = await supabase
        .from("album_sticker_quantities")
        .update({ quantity: next })
        .eq("album_id", albumId)
        .eq("sticker_id", id);

      if (error) {
        setSyncError(error.message);
        return;
      }
      setStickers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, quantity: next } : s))
      );
    },
    [albumId]
  );

  function increment(id: string) {
    void persistIncrement(id);
  }

  function decrement(id: string) {
    void persistDecrement(id);
  }

  const filtered = useMemo(() => {
    let list = stickers;
    if (activeFilter === "owned") list = list.filter((s) => s.quantity >= 1);
    if (activeFilter === "missing") list = list.filter((s) => s.quantity === 0);
    if (activeFilter === "duplicates") list = list.filter((s) => s.quantity > 1);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.country ?? "").toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q)
      );
    }
    return list;
  }, [stickers, activeFilter, search]);

  const counts = useMemo(
    () => ({
      all: stickers.length,
      owned: stickers.filter((s) => s.quantity >= 1).length,
      missing: stickers.filter((s) => s.quantity === 0).length,
      duplicates: stickers.filter((s) => s.quantity > 1).length,
    }),
    [stickers]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
            Colección compartida
          </h1>
          {albumTitle ? (
            <p className="text-sm font-medium text-foreground/90 mt-0.5">{albumTitle}</p>
          ) : null}
          <p className="text-sm text-muted-foreground mt-1">
            Los cambios se guardan para todo el grupo. Toca + / − para actualizar cantidades.
          </p>
        </div>

        {syncError && (
          <p
            role="alert"
            className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600"
          >
            {syncError}
          </p>
        )}

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Busca nombre, país, tipo o código…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-10 text-sm",
              "outline-none placeholder:text-muted-foreground/60",
              "transition-all focus:border-primary focus:ring-2 focus:ring-ring/30"
            )}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div
          className="scrollbar-hide flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Filtrar figuritas"
        >
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={activeFilter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
                activeFilter === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
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

        <p className="text-xs text-muted-foreground">
          Mostrando <strong className="text-foreground">{filtered.length}</strong> figurita
          {filtered.length !== 1 && "s"}
        </p>

        <StickerGrid stickers={filtered} onIncrement={increment} onDecrement={decrement} />
      </main>
    </div>
  );
}
