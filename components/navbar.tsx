"use client";

import { Trophy, LayoutGrid, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Panel", icon: Trophy },
  { href: "/stickers", label: "Colección", icon: LayoutGrid },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-bold tracking-wide text-foreground uppercase">
            Album-Mundial<span className="text-accent">26</span>
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
            onClick={() => void handleLogout()}
            className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </header>
  );
}
