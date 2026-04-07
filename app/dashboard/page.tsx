import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { DashboardMain } from "@/components/dashboard-main";
import { NoAlbumAccess } from "@/components/no-album-access";
import { resolveAlbumIdForUser } from "@/lib/album";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mergeCatalogWithQuantities } from "@/services/stickers";

export default async function DashboardPage() {
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

  const stickers = mergeCatalogWithQuantities(catalog ?? [], qtyRows ?? []);
  const userLabel =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    user.email?.split("@")[0] ||
    "Coleccionista";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardMain stickers={stickers} userLabel={userLabel} albumTitle={albumRow?.name ?? null} />
    </div>
  );
}
