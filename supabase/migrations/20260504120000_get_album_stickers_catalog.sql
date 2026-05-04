-- Una sola consulta para el listado del álbum: catálogo + cantidades (LEFT JOIN).
-- RLS se aplica con SECURITY INVOKER (mismo usuario que la petición PostgREST).

CREATE OR REPLACE FUNCTION public.get_album_stickers_catalog(p_album_id uuid)
RETURNS TABLE (
  id uuid,
  code text,
  name text,
  country text,
  type text,
  quantity integer
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    s.id,
    s.code,
    s.name,
    s.country,
    s.type,
    COALESCE(q.quantity, 0)::integer AS quantity
  FROM public.stickers s
  LEFT JOIN public.album_sticker_quantities q
    ON q.album_id = s.album_id
    AND q.sticker_id = s.id
  WHERE s.album_id = p_album_id
  ORDER BY s.code;
$$;

GRANT EXECUTE ON FUNCTION public.get_album_stickers_catalog(uuid) TO authenticated;
