import type { SupabaseClient } from "@supabase/supabase-js";

/** Mismo id que el seed de `supabase/migrations` (álbum de ejemplo). */
export const SEED_ALBUM_ID = "00000000-0000-4000-8000-000000000001";

/**
 * Álbum activo para el usuario: `NEXT_PUBLIC_ALBUM_ID` si está definido y el usuario es miembro;
 * si no, la primera membresía por `created_at`.
 */
export async function resolveAlbumIdForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const envAlbum = process.env.NEXT_PUBLIC_ALBUM_ID?.trim();
  if (envAlbum) {
    const { data } = await supabase
      .from("album_members")
      .select("album_id")
      .eq("user_id", userId)
      .eq("album_id", envAlbum)
      .maybeSingle();
    if (data?.album_id) return data.album_id;
    return null;
  }

  const { data: rows } = await supabase
    .from("album_members")
    .select("album_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1);

  return rows?.[0]?.album_id ?? null;
}
