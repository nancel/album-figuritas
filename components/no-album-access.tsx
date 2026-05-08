export function NoAlbumAccess() {
  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center space-y-3">
      <p className="text-4xl" aria-hidden="true">
        📒
      </p>
      <h1 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
        Sin álbum asignado
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Tu usuario no figura en ningún álbum compartido. Pedí a quien administra la base que te agregue en{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">album_members</code>. Si tenés más de un álbum
        y la app usa uno fijo, revisá{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_ALBUM_ID</code> en{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>.
      </p>
    </main>
  );
}
