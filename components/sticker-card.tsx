"use client";

import { Loader2, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Sticker } from "@/types/sticker";

interface StickerCardProps {
  sticker: Sticker;
  isSaving?: boolean;
  onIncrement: (id: string) => void | Promise<void>;
  onDecrement: (id: string) => void | Promise<void>;
}

export function StickerCard({
  sticker,
  isSaving = false,
  onIncrement,
  onDecrement,
}: StickerCardProps) {
  const isMissing   = sticker.quantity === 0;
  const isDuplicate = sticker.quantity > 1;
  const isOwned     = sticker.quantity === 1;
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border p-3.5 shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        isMissing   && "border-border bg-muted opacity-60",
        isOwned     && "border-border bg-card",
        isDuplicate && "border-accent/60 bg-amber-50 ring-1 ring-accent/40",
      )}
    >
      {/* Status badge */}
      {isDuplicate && (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold px-1.5 shadow">
          ×{sticker.quantity}
        </span>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-1 mb-2">
        <span className="font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          {sticker.code}
        </span>
      </div>

      {/* Sticker name */}
      <p
        className={cn(
          "text-sm font-semibold leading-tight text-balance mb-1",
          isMissing ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {sticker.name}
      </p>

      {/* Country + type */}
      <div className="flex flex-wrap gap-1 mb-3">
        {sticker.country ? (
          <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[10px] font-medium text-sky-800">
            {sticker.country}
          </span>
        ) : null}
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {sticker.type}
        </span>
      </div>

      {/* Qty controls */}
      <div className="flex items-center justify-between mt-auto gap-2">
        <button
          type="button"
          onClick={() => void onDecrement(sticker.id)}
          disabled={sticker.quantity === 0 || isSaving}
          aria-label={`Quitar una figurita de ${sticker.name}`}
          aria-busy={isSaving}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full border transition-all",
            "active:scale-90",
            sticker.quantity === 0 || isSaving
              ? "cursor-not-allowed border-border text-muted-foreground/40"
              : "border-border bg-card text-foreground hover:bg-muted"
          )}
        >
          <Minus className="h-3 w-3" />
        </button>

        <span
          className={cn(
            "font-display text-lg font-bold min-w-[1.5rem] text-center leading-none tabular-nums",
            isMissing && "text-muted-foreground/50",
            isOwned && "text-primary",
            isDuplicate && "text-yellow-600"
          )}
        >
          {sticker.quantity}
        </span>

        <button
          type="button"
          onClick={() => void onIncrement(sticker.id)}
          disabled={isSaving}
          aria-label={`Añadir una figurita de ${sticker.name}`}
          aria-busy={isSaving}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground transition-all active:scale-90",
            isSaving
              ? "cursor-not-allowed opacity-60"
              : "hover:bg-primary/90"
          )}
        >
          {isSaving ? (
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  );
}
