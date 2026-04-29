-- Álbumes compartidos: varios usuarios ven y editan las mismas cantidades por álbum.
-- Catálogo por álbum; cantidades en album_sticker_quantities (sin fila = falta; quantity >= 1).
-- Usuarios, membresías y altas de álbum: fuera de la app (SQL / dashboard Supabase).

DROP TABLE IF EXISTS public.user_stickers CASCADE;
DROP TABLE IF EXISTS public.album_sticker_quantities CASCADE;
DROP TABLE IF EXISTS public.stickers CASCADE;
DROP TABLE IF EXISTS public.album_members CASCADE;
DROP TABLE IF EXISTS public.albums CASCADE;

-- Catálogo seed (mismo UUID en README / .env opcional)
CREATE TABLE public.albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.album_members (
  album_id uuid NOT NULL REFERENCES public.albums (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (album_id, user_id)
);

CREATE INDEX album_members_user_id_idx ON public.album_members (user_id);

CREATE TABLE public.stickers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES public.albums (id) ON DELETE CASCADE,
  code text NOT NULL,
  name text NOT NULL,
  country text,
  type text NOT NULL,
  UNIQUE (album_id, code)
);

CREATE INDEX stickers_album_id_idx ON public.stickers (album_id);

CREATE TABLE public.album_sticker_quantities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES public.albums (id) ON DELETE CASCADE,
  sticker_id uuid NOT NULL REFERENCES public.stickers (id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity >= 1),
  UNIQUE (album_id, sticker_id)
);

CREATE INDEX album_sticker_quantities_album_id_idx ON public.album_sticker_quantities (album_id);

ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_sticker_quantities ENABLE ROW LEVEL SECURITY;

-- Ver solo álbumes donde el usuario es miembro
CREATE POLICY "albums_select_member"
  ON public.albums FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.album_members m
      WHERE m.album_id = albums.id AND m.user_id = auth.uid()
    )
  );

-- Ver propias membresías (resolver álbum)
CREATE POLICY "album_members_select_own"
  ON public.album_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Catálogo: solo si es miembro del álbum (sin escritura desde la app)
CREATE POLICY "stickers_select_member"
  ON public.stickers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.album_members m
      WHERE m.album_id = stickers.album_id AND m.user_id = auth.uid()
    )
  );

-- Cantidades compartidas del álbum
CREATE POLICY "album_sticker_quantities_select_member"
  ON public.album_sticker_quantities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.album_members m
      WHERE m.album_id = album_sticker_quantities.album_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "album_sticker_quantities_insert_member"
  ON public.album_sticker_quantities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.album_members m
      WHERE m.album_id = album_sticker_quantities.album_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "album_sticker_quantities_update_member"
  ON public.album_sticker_quantities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.album_members m
      WHERE m.album_id = album_sticker_quantities.album_id AND m.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.album_members m
      WHERE m.album_id = album_sticker_quantities.album_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "album_sticker_quantities_delete_member"
  ON public.album_sticker_quantities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.album_members m
      WHERE m.album_id = album_sticker_quantities.album_id AND m.user_id = auth.uid()
    )
  );

-- Álbum de ejemplo (asociar usuarios manualmente en album_members)
INSERT INTO public.albums (id, name) VALUES
  ('00000000-0000-4000-8000-000000000001'::uuid, 'Mundial 2026 (ejemplo)');
-- El catálogo final (1175 figuritas) se genera desde:
--   data/listado-figuritad.txt
-- usando:
--   node scripts/generate-stickers-seed.mjs
-- Esto crea:
--   supabase/seeds/2026_stickers_inserts.sql
