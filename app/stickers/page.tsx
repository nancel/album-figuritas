import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mergeCatalogWithUserRows } from "@/services/stickers";
import StickersClient from "./stickers-client";

export default async function Page() {
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

  const initialStickers = mergeCatalogWithUserRows(catalog ?? [], userRows ?? []);

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StickersClient initialStickers={initialStickers} userId={user.id} />
    </Suspense>
  );
}
