"use client";

import { Sticker, CheckCircle2, Copy, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  total: number;
  owned: number;
  missing: number;
  duplicates: number;
}

export function SummaryCards({ total, owned, missing, duplicates }: SummaryCardsProps) {
  const cards = [
    {
      label: "Tengo",
      value: owned,
      sub: `de ${total}`,
      icon: CheckCircle2,
      colorClass: "text-primary bg-primary/10",
      textClass: "text-primary",
    },
    {
      label: "Falta",
      value: missing,
      sub: "aún necesarios",
      icon: AlertCircle,
      colorClass: "text-rose-600 bg-rose-100",
      textClass: "text-rose-600",
    },
    {
      label: "Duplicados",
      value: duplicates,
      sub: "para intercambiar",
      icon: Copy,
      colorClass: "text-accent-foreground bg-accent/40",
      textClass: "text-yellow-700",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map(({ label, value, sub, icon: Icon, colorClass, textClass }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-4 shadow-sm text-center"
        >
          <div className={cn("rounded-full p-2", colorClass)}>
            <Icon className="h-4 w-4" />
          </div>
          <span className={cn("font-display text-2xl font-bold leading-none tracking-wide", textClass)}>
            {value}
          </span>
          <span className="text-xs font-medium text-foreground leading-tight">{label}</span>
          <span className="text-xs text-muted-foreground leading-tight">{sub}</span>
        </div>
      ))}
    </div>
  );
}
