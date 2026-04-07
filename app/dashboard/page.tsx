import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { DashboardMain } from "@/components/dashboard-main";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mergeCatalogWithUserRows } from "@/services/stickers";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: catalog } = await supabase
    .from("stickers")
    .select("id, code, country, player_name, country_code, position")
    .order("code", { ascending: true });

  const { data: userRows } = await supabase
    .from("user_stickers")
    .select("sticker_id, quantity")
    .eq("user_id", user.id);

  const stickers = mergeCatalogWithUserRows(catalog ?? [], userRows ?? []);
  const userLabel =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    user.email?.split("@")[0] ||
    "Coleccionista";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardMain stickers={stickers} userLabel={userLabel} />
    </div>
  );
}
