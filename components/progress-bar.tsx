"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  total: number;
  owned: number;
}

export function ProgressBar({ value, total, owned }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Progreso del Álbum</span>
        <span className="font-display text-lg font-bold text-primary tracking-wide">
          {value.toFixed(0)}%
        </span>
      </div>

      {/* Track */}
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full bg-primary transition-all duration-700 ease-out",
            "relative overflow-hidden"
          )}
          style={{ width: `${value}%` }}
        >
          {/* shimmer */}
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {owned} de {total} figuritas recolectadas
      </p>
    </div>
  );
}
