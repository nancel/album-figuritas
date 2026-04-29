import type { SupabaseClient } from "@supabase/supabase-js";
import { displayLabelFromUser } from "@/lib/user-display";

/** Registra un evento tras un cambio exitoso en cantidades (no lanza si falla el log). */
export async function logStickerQuantityEvent(
  supabase: SupabaseClient,
  albumId: string,
  stickerId: string,
  delta: number
): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return;

  const { error } = await supabase.from("album_sticker_quantity_events").insert({
    album_id: albumId,
    sticker_id: stickerId,
    user_id: session.user.id,
    delta,
    actor_label: displayLabelFromUser(session.user),
  });

  if (error) console.error("[quantity event]", error.message);
}
