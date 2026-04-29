import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { DashboardMain } from "@/components/dashboard-main";
import { NoAlbumAccess } from "@/components/no-album-access";
import { resolveAlbumIdForUser } from "@/lib/album";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { displayLabelFromUser } from "@/lib/user-display";
import { fetchRecentQuantityChanges } from "@/services/quantity-events";
import { mergeCatalogWithQuantities } from "@/services/stickers";

const PAGE_SIZE = 1000;

async function fetchAllCatalog(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  albumId: string
) {
  const rows: { id: string; code: string; name: string; country: string | null; type: string }[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from("stickers")
      .select("id, code, name, country, type")
      .eq("album_id", albumId)
      .order("code", { ascending: true })
      .range(from, to);

    if (error) throw error;
    if (!data || data.length === 0) break;

    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

async function fetchAllQuantities(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  albumId: string
) {
  const rows: { sticker_id: string; quantity: number }[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from("album_sticker_quantities")
      .select("sticker_id, quantity")
      .eq("album_id", albumId)
      .range(from, to);

    if (error) throw error;
    if (!data || data.length === 0) break;

    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

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

  const [catalog, qtyRows, recentChanges] = await Promise.all([
    fetchAllCatalog(supabase, albumId),
    fetchAllQuantities(supabase, albumId),
    fetchRecentQuantityChanges(supabase, albumId, 15),
  ]);

  const stickers = mergeCatalogWithQuantities(catalog ?? [], qtyRows ?? []);
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
