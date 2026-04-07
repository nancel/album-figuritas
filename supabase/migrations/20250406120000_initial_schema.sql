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
  country text NOT NULL,
  player_name text NOT NULL,
  country_code text NOT NULL,
  position text NOT NULL DEFAULT '',
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

-- Álbum y catálogo de ejemplo (asociar usuarios manualmente en album_members)
INSERT INTO public.albums (id, name) VALUES
  ('00000000-0000-4000-8000-000000000001'::uuid, 'Mundial 2026 (ejemplo)');

INSERT INTO public.stickers (album_id, code, country, player_name, country_code, position) VALUES
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ARG-01', 'Argentina', 'Lionel Messi', 'ARG', 'Forward'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ARG-02', 'Argentina', 'Ángel Di María', 'ARG', 'Winger'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ARG-03', 'Argentina', 'Julián Álvarez', 'ARG', 'Forward'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ARG-04', 'Argentina', 'Emiliano Martínez', 'ARG', 'Goalkeeper'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ARG-05', 'Argentina', 'Rodrigo De Paul', 'ARG', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'BRA-01', 'Brazil', 'Vinicius Jr.', 'BRA', 'Winger'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'BRA-02', 'Brazil', 'Rodrygo', 'BRA', 'Winger'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'BRA-03', 'Brazil', 'Casemiro', 'BRA', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'BRA-04', 'Brazil', 'Marquinhos', 'BRA', 'Defender'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'BRA-05', 'Brazil', 'Alisson Becker', 'BRA', 'Goalkeeper'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'FRA-01', 'France', 'Kylian Mbappé', 'FRA', 'Forward'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'FRA-02', 'France', 'Antoine Griezmann', 'FRA', 'Forward'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'FRA-03', 'France', 'Aurélien Tchouaméni', 'FRA', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'FRA-04', 'France', 'William Saliba', 'FRA', 'Defender'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'FRA-05', 'France', 'Mike Maignan', 'FRA', 'Goalkeeper'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ENG-01', 'England', 'Harry Kane', 'ENG', 'Forward'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ENG-02', 'England', 'Jude Bellingham', 'ENG', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ENG-03', 'England', 'Phil Foden', 'ENG', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ENG-04', 'England', 'Bukayo Saka', 'ENG', 'Winger'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ENG-05', 'England', 'Jordan Pickford', 'ENG', 'Goalkeeper'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'GER-01', 'Germany', 'Florian Wirtz', 'GER', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'GER-02', 'Germany', 'Jamal Musiala', 'GER', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'GER-03', 'Germany', 'Joshua Kimmich', 'GER', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'GER-04', 'Germany', 'Antonio Rüdiger', 'GER', 'Defender'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'GER-05', 'Germany', 'Manuel Neuer', 'GER', 'Goalkeeper'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ESP-01', 'Spain', 'Pedri', 'ESP', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ESP-02', 'Spain', 'Lamine Yamal', 'ESP', 'Winger'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ESP-03', 'Spain', 'Álvaro Morata', 'ESP', 'Forward'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ESP-04', 'Spain', 'Rodri', 'ESP', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ESP-05', 'Spain', 'Unai Simón', 'ESP', 'Goalkeeper'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'POR-01', 'Portugal', 'Cristiano Ronaldo', 'POR', 'Forward'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'POR-02', 'Portugal', 'Bruno Fernandes', 'POR', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'POR-03', 'Portugal', 'Rafael Leão', 'POR', 'Winger'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'POR-04', 'Portugal', 'Rúben Dias', 'POR', 'Defender'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'POR-05', 'Portugal', 'Diogo Costa', 'POR', 'Goalkeeper'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'NED-01', 'Netherlands', 'Virgil van Dijk', 'NED', 'Defender'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'NED-02', 'Netherlands', 'Xavi Simons', 'NED', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'NED-03', 'Netherlands', 'Cody Gakpo', 'NED', 'Forward'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'NED-04', 'Netherlands', 'Frenkie de Jong', 'NED', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'NED-05', 'Netherlands', 'Bart Verbruggen', 'NED', 'Goalkeeper'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ITA-01', 'Italy', 'Federico Chiesa', 'ITA', 'Winger'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ITA-02', 'Italy', 'Sandro Tonali', 'ITA', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ITA-03', 'Italy', 'Ciro Immobile', 'ITA', 'Forward'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ITA-04', 'Italy', 'Alessandro Bastoni', 'ITA', 'Defender'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'ITA-05', 'Italy', 'Gianluigi Donnarumma', 'ITA', 'Goalkeeper'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'MAR-01', 'Morocco', 'Achraf Hakimi', 'MAR', 'Defender'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'MAR-02', 'Morocco', 'Hakim Ziyech', 'MAR', 'Winger'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'MAR-03', 'Morocco', 'Sofiane Boufal', 'MAR', 'Winger'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'MAR-04', 'Morocco', 'Nayef Aguerd', 'MAR', 'Defender'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'MAR-05', 'Morocco', 'Yassine Bounou', 'MAR', 'Goalkeeper'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'USA-01', 'USA', 'Christian Pulisic', 'USA', 'Winger'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'USA-02', 'USA', 'Tyler Adams', 'USA', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'USA-03', 'USA', 'Gio Reyna', 'USA', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'USA-04', 'USA', 'Weston McKennie', 'USA', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'USA-05', 'USA', 'Matt Turner', 'USA', 'Goalkeeper'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'JPN-01', 'Japan', 'Takumi Minamino', 'JPN', 'Forward'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'JPN-02', 'Japan', 'Daichi Kamada', 'JPN', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'JPN-03', 'Japan', 'Wataru Endo', 'JPN', 'Midfielder'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'JPN-04', 'Japan', 'Hiroki Sakai', 'JPN', 'Defender'),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'JPN-05', 'Japan', 'Shuichi Gonda', 'JPN', 'Goalkeeper');
