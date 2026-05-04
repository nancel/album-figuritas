import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { DashboardMain } from "@/components/dashboard-main";
import { NoAlbumAccess } from "@/components/no-album-access";
import { resolveAlbumIdForUser } from "@/lib/album";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { displayLabelFromUser } from "@/lib/user-display";
import { fetchRecentQuantityChanges } from "@/services/quantity-events";
import { fetchAlbumStickersWithQuantities } from "@/services/stickers";

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

  const [{ data: albumRow }, stickers, recentChanges] = await Promise.all([
    supabase.from("albums").select("name").eq("id", albumId).single(),
    fetchAlbumStickersWithQuantities(supabase, albumId),
    fetchRecentQuantityChanges(supabase, albumId, 15),
  ]);

  const userLabel = displayLabelFromUser(user);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardMain
        stickers={stickers}
        userLabel={userLabel}
        albumTitle={albumRow?.name ?? null}
        recentChanges={recentChanges}
      />
    </div>
  );
}
