-- Remove promo/extra stickers from existing catalogs.
-- This includes McDonald's exclusives and special variants (silver/gold/bronze).
DELETE FROM public.stickers
WHERE
  lower(type) LIKE '%mcdonald%'
  OR lower(type) LIKE 'extra%'
  OR lower(type) LIKE '%silver%'
  OR lower(type) LIKE '%gold%'
  OR lower(type) LIKE '%bronze%';
