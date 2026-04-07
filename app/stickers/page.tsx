import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { NoAlbumAccess } from "@/components/no-album-access";
import { resolveAlbumIdForUser } from "@/lib/album";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mergeCatalogWithQuantities } from "@/services/stickers";
import StickersClient from "./stickers-client";

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const albumId = await resolveAlbumIdForUser(supabase, user.id);
  if (!albumId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <NoAlbumAccess />
      </div>
    );
  }

  const { data: albumRow } = await supabase.from("albums").select("name").eq("id", albumId).single();

  const { data: catalog } = await supabase
    .from("stickers")
    .select("id, code, country, player_name, country_code, position")
    .eq("album_id", albumId)
    .order("code", { ascending: true });

  const { data: qtyRows } = await supabase
    .from("album_sticker_quantities")
    .select("sticker_id, quantity")
    .eq("album_id", albumId);

  const initialStickers = mergeCatalogWithQuantities(catalog ?? [], qtyRows ?? []);

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StickersClient initialStickers={initialStickers} albumId={albumId} albumTitle={albumRow?.name ?? null} />
    </Suspense>
  );
}
