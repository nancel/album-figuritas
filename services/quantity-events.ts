import type { SupabaseClient } from "@supabase/supabase-js";

export type RecentQuantityChange = {
  code: string;
  name: string;
  country: string | null;
  delta: number;
  actorLabel: string;
  createdAt: string;
};

function normalizeStickerEmbed(
  stickers:
    | { code: string; name: string; country: string | null }
    | { code: string; name: string; country: string | null }[]
    | null
): { code: string; name: string; country: string | null } | null {
  if (!stickers) return null;
  return Array.isArray(stickers) ? stickers[0] ?? null : stickers;
}

export async function fetchRecentQuantityChanges(
  supabase: SupabaseClient,
  albumId: string,
  limit = 15
): Promise<RecentQuantityChange[]> {
  const { data, error } = await supabase
    .from("album_sticker_quantity_events")
    .select(
      `
      delta,
      actor_label,
      created_at,
      stickers ( code, name, country )
    `
    )
    .eq("album_id", albumId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  const rows = data as {
    delta: number;
    actor_label: string;
    created_at: string;
    stickers:
      | { code: string; name: string; country: string | null }
      | { code: string; name: string; country: string | null }[]
      | null;
  }[];

  return (
    rows?.map((row) => {
      const s = normalizeStickerEmbed(row.stickers);
      return {
        code: s?.code ?? "—",
        name: s?.name ?? "—",
        country: s?.country ?? null,
        delta: row.delta,
        actorLabel: row.actor_label,
        createdAt: row.created_at,
      };
    }) ?? []
  );
}
