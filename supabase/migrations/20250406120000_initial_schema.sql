-- Catalog + per-user quantities (no row = missing; quantity >= 1 only)

CREATE TABLE public.stickers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  country text NOT NULL,
  player_name text NOT NULL,
  country_code text NOT NULL,
  position text NOT NULL DEFAULT ''
);

CREATE TABLE public.user_stickers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  sticker_id uuid NOT NULL REFERENCES public.stickers (id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity >= 1),
  UNIQUE (user_id, sticker_id)
);

CREATE INDEX user_stickers_user_id_idx ON public.user_stickers (user_id);

ALTER TABLE public.stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stickers ENABLE ROW LEVEL SECURITY;

-- Public read-only catalog (anon + authenticated)
CREATE POLICY "stickers_select_public"
  ON public.stickers FOR SELECT
  TO anon, authenticated
  USING (true);

-- Own rows only
CREATE POLICY "user_stickers_select_own"
  ON public.user_stickers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_stickers_insert_own"
  ON public.user_stickers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_stickers_update_own"
  ON public.user_stickers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_stickers_delete_own"
  ON public.user_stickers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

INSERT INTO public.stickers (code, country, player_name, country_code, position) VALUES
  ('ARG-01', 'Argentina', 'Lionel Messi', 'ARG', 'Forward'),
  ('ARG-02', 'Argentina', 'Ángel Di María', 'ARG', 'Winger'),
  ('ARG-03', 'Argentina', 'Julián Álvarez', 'ARG', 'Forward'),
  ('ARG-04', 'Argentina', 'Emiliano Martínez', 'ARG', 'Goalkeeper'),
  ('ARG-05', 'Argentina', 'Rodrigo De Paul', 'ARG', 'Midfielder'),
  ('BRA-01', 'Brazil', 'Vinicius Jr.', 'BRA', 'Winger'),
  ('BRA-02', 'Brazil', 'Rodrygo', 'BRA', 'Winger'),
  ('BRA-03', 'Brazil', 'Casemiro', 'BRA', 'Midfielder'),
  ('BRA-04', 'Brazil', 'Marquinhos', 'BRA', 'Defender'),
  ('BRA-05', 'Brazil', 'Alisson Becker', 'BRA', 'Goalkeeper'),
  ('FRA-01', 'France', 'Kylian Mbappé', 'FRA', 'Forward'),
  ('FRA-02', 'France', 'Antoine Griezmann', 'FRA', 'Forward'),
  ('FRA-03', 'France', 'Aurélien Tchouaméni', 'FRA', 'Midfielder'),
  ('FRA-04', 'France', 'William Saliba', 'FRA', 'Defender'),
  ('FRA-05', 'France', 'Mike Maignan', 'FRA', 'Goalkeeper'),
  ('ENG-01', 'England', 'Harry Kane', 'ENG', 'Forward'),
  ('ENG-02', 'England', 'Jude Bellingham', 'ENG', 'Midfielder'),
  ('ENG-03', 'England', 'Phil Foden', 'ENG', 'Midfielder'),
  ('ENG-04', 'England', 'Bukayo Saka', 'ENG', 'Winger'),
  ('ENG-05', 'England', 'Jordan Pickford', 'ENG', 'Goalkeeper'),
  ('GER-01', 'Germany', 'Florian Wirtz', 'GER', 'Midfielder'),
  ('GER-02', 'Germany', 'Jamal Musiala', 'GER', 'Midfielder'),
  ('GER-03', 'Germany', 'Joshua Kimmich', 'GER', 'Midfielder'),
  ('GER-04', 'Germany', 'Antonio Rüdiger', 'GER', 'Defender'),
  ('GER-05', 'Germany', 'Manuel Neuer', 'GER', 'Goalkeeper'),
  ('ESP-01', 'Spain', 'Pedri', 'ESP', 'Midfielder'),
  ('ESP-02', 'Spain', 'Lamine Yamal', 'ESP', 'Winger'),
  ('ESP-03', 'Spain', 'Álvaro Morata', 'ESP', 'Forward'),
  ('ESP-04', 'Spain', 'Rodri', 'ESP', 'Midfielder'),
  ('ESP-05', 'Spain', 'Unai Simón', 'ESP', 'Goalkeeper'),
  ('POR-01', 'Portugal', 'Cristiano Ronaldo', 'POR', 'Forward'),
  ('POR-02', 'Portugal', 'Bruno Fernandes', 'POR', 'Midfielder'),
  ('POR-03', 'Portugal', 'Rafael Leão', 'POR', 'Winger'),
  ('POR-04', 'Portugal', 'Rúben Dias', 'POR', 'Defender'),
  ('POR-05', 'Portugal', 'Diogo Costa', 'POR', 'Goalkeeper'),
  ('NED-01', 'Netherlands', 'Virgil van Dijk', 'NED', 'Defender'),
  ('NED-02', 'Netherlands', 'Xavi Simons', 'NED', 'Midfielder'),
  ('NED-03', 'Netherlands', 'Cody Gakpo', 'NED', 'Forward'),
  ('NED-04', 'Netherlands', 'Frenkie de Jong', 'NED', 'Midfielder'),
  ('NED-05', 'Netherlands', 'Bart Verbruggen', 'NED', 'Goalkeeper'),
  ('ITA-01', 'Italy', 'Federico Chiesa', 'ITA', 'Winger'),
  ('ITA-02', 'Italy', 'Sandro Tonali', 'ITA', 'Midfielder'),
  ('ITA-03', 'Italy', 'Ciro Immobile', 'ITA', 'Forward'),
  ('ITA-04', 'Italy', 'Alessandro Bastoni', 'ITA', 'Defender'),
  ('ITA-05', 'Italy', 'Gianluigi Donnarumma', 'ITA', 'Goalkeeper'),
  ('MAR-01', 'Morocco', 'Achraf Hakimi', 'MAR', 'Defender'),
  ('MAR-02', 'Morocco', 'Hakim Ziyech', 'MAR', 'Winger'),
  ('MAR-03', 'Morocco', 'Sofiane Boufal', 'MAR', 'Winger'),
  ('MAR-04', 'Morocco', 'Nayef Aguerd', 'MAR', 'Defender'),
  ('MAR-05', 'Morocco', 'Yassine Bounou', 'MAR', 'Goalkeeper'),
  ('USA-01', 'USA', 'Christian Pulisic', 'USA', 'Winger'),
  ('USA-02', 'USA', 'Tyler Adams', 'USA', 'Midfielder'),
  ('USA-03', 'USA', 'Gio Reyna', 'USA', 'Midfielder'),
  ('USA-04', 'USA', 'Weston McKennie', 'USA', 'Midfielder'),
  ('USA-05', 'USA', 'Matt Turner', 'USA', 'Goalkeeper'),
  ('JPN-01', 'Japan', 'Takumi Minamino', 'JPN', 'Forward'),
  ('JPN-02', 'Japan', 'Daichi Kamada', 'JPN', 'Midfielder'),
  ('JPN-03', 'Japan', 'Wataru Endo', 'JPN', 'Midfielder'),
  ('JPN-04', 'Japan', 'Hiroki Sakai', 'JPN', 'Defender'),
  ('JPN-05', 'Japan', 'Shuichi Gonda', 'JPN', 'Goalkeeper');
