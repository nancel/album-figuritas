-- Registro de cada +1 / -1 en cantidades (para “últimos cambios” y estadísticas).
CREATE TABLE public.album_sticker_quantity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES public.albums (id) ON DELETE CASCADE,
  sticker_id uuid NOT NULL REFERENCES public.stickers (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  delta integer NOT NULL CHECK (delta <> 0),
  actor_label text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX album_sticker_quantity_events_album_created_idx
  ON public.album_sticker_quantity_events (album_id, created_at DESC);

ALTER TABLE public.album_sticker_quantity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "album_sticker_quantity_events_select_member"
  ON public.album_sticker_quantity_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.album_members m
      WHERE m.album_id = album_sticker_quantity_events.album_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "album_sticker_quantity_events_insert_own"
  ON public.album_sticker_quantity_events FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.album_members m
      WHERE m.album_id = album_sticker_quantity_events.album_id AND m.user_id = auth.uid()
    )
  );
