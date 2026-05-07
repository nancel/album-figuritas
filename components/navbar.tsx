"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, LayoutDashboard, LayoutGrid, Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/stickers", label: "Colección", icon: LayoutGrid },
  { href: "/fixture", label: "Fixture", icon: CalendarDays },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);

  async function handleLogout() {
    setLogoutLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch {
      setLogoutLoading(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full shadow-sm ring-1 ring-border/50 group-hover:scale-105 transition-transform">
            <Image
              src="/mundial_2026.png"
              alt="Mundial 2026"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-display text-lg font-bold tracking-wide text-foreground uppercase">
            Album-Mundial<span className="text-accent">-26</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}

          <button
            type="button"
            disabled={logoutLoading}
            onClick={() => void handleLogout()}
            className={cn(
              "ml-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              logoutLoading
                ? "cursor-not-allowed text-muted-foreground/60"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-label={logoutLoading ? "Cerrando sesión…" : "Cerrar sesión"}
          >
            {logoutLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
