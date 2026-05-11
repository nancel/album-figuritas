import type { SupabaseClient } from "@supabase/supabase-js";
import type { Sticker } from "@/types/sticker";

/** Fila devuelta por `get_album_stickers_catalog` (PostgREST / RPC). */
type AlbumStickersCatalogRow = {
  id: string;
  code: string;
  name: string;
  country: string | null;
  type: string;
  quantity: number;
};

/**
 * Catálogo completo del álbum con cantidades en una sola ida a la base (RPC + JOIN).
 * Sustituye el patrón anterior de varias consultas paginadas a `stickers` y `album_sticker_quantities`.
 */
export async function fetchAlbumStickersWithQuantities(
  supabase: SupabaseClient,
  albumId: string
): Promise<Sticker[]> {
  const { data, error } = await supabase.rpc("get_album_stickers_catalog", {
    p_album_id: albumId,
  });
  if (error) throw error;
  const rows = (data ?? []) as AlbumStickersCatalogRow[];
  return rows.map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    country: row.country,
    type: row.type,
    quantity: row.quantity,
  }));
}

export type StickerCatalogRow = {
  id: string;
  code: string;
  name: string;
  country: string | null;
  type: string;
};

export type AlbumQuantityRow = {
  sticker_id: string;
  quantity: number;
};

export function mergeCatalogWithQuantities(
  catalog: StickerCatalogRow[],
  quantityRows: AlbumQuantityRow[]
): Sticker[] {
  const qtyBySticker = new Map(quantityRows.map((r) => [r.sticker_id, r.quantity]));
  return catalog.map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    country: row.country,
    type: row.type,
    quantity: qtyBySticker.get(row.id) ?? 0,
  }));
}

export type AlbumStats = {
  total: number;
  owned: number;
  missing: number;
  /** Casilleros del álbum con más de una copia (cuántas figuritas distintas tienen duplicado). */
  duplicateTypes: number;
  /** Total de copias que sobran para el álbum: suma de (cantidad − 1) cuando cantidad > 1. */
  duplicateExtras: number;
  progress: number;
  countryStats: {
    name: string;
    total: number;
    owned: number;
    pct: number;
  }[];
};

export function computeAlbumStats(stickers: Sticker[]): AlbumStats {
  const total = stickers.length;
  const owned = stickers.filter((s) => s.quantity >= 1).length;
  const missing = stickers.filter((s) => s.quantity === 0).length;
  let duplicateTypes = 0;
  let duplicateExtras = 0;
  for (const s of stickers) {
    if (s.quantity > 1) {
      duplicateTypes += 1;
      duplicateExtras += s.quantity - 1;
    }
  }
  const progress = total ? (owned / total) * 100 : 0;

  const byCountry = stickers.reduce<
    Record<string, { total: number; owned: number }>
  >((acc, s) => {
    if (!s.country) return acc;
    if (!acc[s.country]) acc[s.country] = { total: 0, owned: 0 };
    acc[s.country].total += 1;
    if (s.quantity > 0) acc[s.country].owned++;
    return acc;
  }, {});

  const countryStats = Object.entries(byCountry)
    .map(([name, v]) => ({
      name,
      ...v,
      pct: Math.round((v.owned / v.total) * 100),
    }))
    .sort((a, b) => b.pct - a.pct);

  return { total, owned, missing, duplicateTypes, duplicateExtras, progress, countryStats };
}
