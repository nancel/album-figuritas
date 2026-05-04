import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";

export function PageLoadingShell({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div
        className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 px-4 py-20"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader2
          className="h-10 w-10 shrink-0 animate-spin text-primary"
          aria-hidden
        />
        <p className="text-center text-sm font-medium text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
}
