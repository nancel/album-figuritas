import type { Sticker } from "@/types/sticker";

export type StickerCatalogRow = {
  id: string;
  code: string;
  country: string;
  player_name: string;
  country_code: string;
  position: string;
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
    playerName: row.player_name,
    country: row.country,
    countryCode: row.country_code,
    position: row.position,
    quantity: qtyBySticker.get(row.id) ?? 0,
  }));
}

export type AlbumStats = {
  total: number;
  owned: number;
  missing: number;
  duplicates: number;
  progress: number;
  countryStats: {
    name: string;
    total: number;
    owned: number;
    code: string;
    pct: number;
  }[];
};

export function computeAlbumStats(stickers: Sticker[]): AlbumStats {
  const total = stickers.length;
  const owned = stickers.filter((s) => s.quantity >= 1).length;
  const missing = stickers.filter((s) => s.quantity === 0).length;
  const duplicates = stickers.filter((s) => s.quantity > 1).length;
  const progress = total ? (owned / total) * 100 : 0;

  const byCountry = stickers.reduce<
    Record<string, { total: number; owned: number; code: string }>
  >((acc, s) => {
    if (!acc[s.country]) acc[s.country] = { total: 0, owned: 0, code: s.countryCode };
    acc[s.country].total++;
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

  return { total, owned, missing, duplicates, progress, countryStats };
}
