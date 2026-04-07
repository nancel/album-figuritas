"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { countryFlags, countryColors } from "@/lib/mock-data";
import type { Sticker } from "@/types/sticker";

interface StickerCardProps {
  sticker: Sticker;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export function StickerCard({ sticker, onIncrement, onDecrement }: StickerCardProps) {
  const isMissing   = sticker.quantity === 0;
  const isDuplicate = sticker.quantity > 1;
  const isOwned     = sticker.quantity === 1;
  const flag        = countryFlags[sticker.countryCode] ?? "🏳️";
  const colors      = countryColors[sticker.countryCode] ?? { bg: "bg-gray-100", text: "text-gray-700" };

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
        <span className="text-base leading-none" aria-hidden="true">{flag}</span>
      </div>

      {/* Player name */}
      <p
        className={cn(
          "text-sm font-semibold leading-tight text-balance mb-1",
          isMissing ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {sticker.playerName}
      </p>

      {/* Country + position */}
      <div className="flex flex-wrap gap-1 mb-3">
        <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-medium", colors.bg, colors.text)}>
          {sticker.country}
        </span>
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {sticker.position}
        </span>
      </div>

      {/* Qty controls */}
      <div className="flex items-center justify-between mt-auto gap-2">
        <button
          onClick={() => onDecrement(sticker.id)}
          disabled={sticker.quantity === 0}
          aria-label={`Quitar una figurita de ${sticker.playerName}`}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full border transition-all",
            "active:scale-90",
            sticker.quantity === 0
              ? "cursor-not-allowed border-border text-muted-foreground/40"
              : "border-border bg-card text-foreground hover:bg-muted"
          )}
        >
          <Minus className="h-3 w-3" />
        </button>

        <span className={cn(
          "font-display text-lg font-bold w-6 text-center leading-none",
          isMissing   && "text-muted-foreground/50",
          isOwned     && "text-primary",
          isDuplicate && "text-yellow-600"
        )}>
          {sticker.quantity}
        </span>

        <button
          onClick={() => onIncrement(sticker.id)}
          aria-label={`Añadir una figurita de ${sticker.playerName}`}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-90"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
