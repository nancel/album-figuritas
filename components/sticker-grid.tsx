"use client";

import type { Sticker } from "@/types/sticker";
import { StickerCard } from "@/components/sticker-card";

interface StickerGridProps {
  stickers: Sticker[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export function StickerGrid({ stickers, onIncrement, onDecrement }: StickerGridProps) {
  if (stickers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
        <span className="text-5xl" aria-hidden="true">🔍</span>
        <p className="text-base font-semibold text-muted-foreground">No stickers found</p>
        <p className="text-sm text-muted-foreground">Try a different filter or search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {stickers.map((sticker) => (
        <StickerCard
          key={sticker.id}
          sticker={sticker}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      ))}
    </div>
  );
}
