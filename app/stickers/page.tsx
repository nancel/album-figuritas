import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { NoAlbumAccess } from "@/components/no-album-access";
import { resolveAlbumIdForUser } from "@/lib/album";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchAlbumStickersWithQuantities } from "@/services/stickers";
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

  const [{ data: albumRow }, initialStickers] = await Promise.all([
    supabase.from("albums").select("name").eq("id", albumId).single(),
    fetchAlbumStickersWithQuantities(supabase, albumId),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StickersClient initialStickers={initialStickers} albumId={albumId} albumTitle={albumRow?.name ?? null} />
    </Suspense>
  );
}
