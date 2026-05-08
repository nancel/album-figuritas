import type { SupabaseClient } from "@supabase/supabase-js";

/** Mismo id que el seed de `supabase/migrations` (álbum de ejemplo). */
export const SEED_ALBUM_ID = "00000000-0000-4000-8000-000000000001";

/**
 * Álbum activo para el usuario.
 * - Una sola membresía: siempre ese álbum (cada usuario ve “su” álbum compartido).
 * - Varias membresías: `NEXT_PUBLIC_ALBUM_ID` si está definido y el usuario pertenece a ese álbum;
 *   si no, la primera membresía por `created_at`.
 */
export async function resolveAlbumIdForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data: rows } = await supabase
    .from("album_members")
    .select("album_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (!rows?.length) return null;
  if (rows.length === 1) return rows[0].album_id;

  const envAlbum = process.env.NEXT_PUBLIC_ALBUM_ID?.trim();
  if (envAlbum && rows.some((r) => r.album_id === envAlbum)) {
    return envAlbum;
  }

  return rows[0].album_id;
}
