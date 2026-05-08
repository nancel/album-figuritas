-- Nuevo álbum compartido + 4 usuarios (creación en Auth + membresías).
--
-- Requisitos: extensión pgcrypto (en Supabase suele estar habilitada; si falla crypt():
--   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
--
-- Login en la app (usuario corto): felipe, guille, jose, lucia
-- Emails internos: *_@album.local  (ajustá si NEXT_PUBLIC_AUTH_EMAIL_DOMAIN es otro)
-- Contraseña para los cuatro: eldiego
--
-- Álbum id ...0002. Para fijar este álbum en la app: NEXT_PUBLIC_ALBUM_ID=00000000-0000-4000-8000-000000000002

BEGIN;

-- ---------- Usuarios Auth (insert o actualiza password + name) ----------
WITH target_users AS (
  SELECT *
  FROM (
    VALUES
      ('felipe@album.local', 'Felipe'),
      ('guille@album.local', 'Guille'),
      ('jose@album.local', 'José'),
      ('lucia@album.local', 'Lucía')
  ) AS t(email, display_name)
),

inserted_users AS (
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  SELECT
    '00000000-0000-0000-0000-000000000000'::uuid,
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    t.email,
    crypt('eldiego', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', t.display_name),
    now(),
    now(),
    '',
    '',
    '',
    ''
  FROM target_users t
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users u WHERE u.email = t.email
  )
  RETURNING id, email
),

updated_users AS (
  UPDATE auth.users u
  SET
    encrypted_password = crypt('eldiego', gen_salt('bf')),
    email_confirmed_at = COALESCE(u.email_confirmed_at, now()),
    raw_user_meta_data = jsonb_set(
      COALESCE(u.raw_user_meta_data, '{}'::jsonb),
      '{name}',
      to_jsonb(t.display_name)
    ),
    raw_app_meta_data = COALESCE(
      u.raw_app_meta_data,
      '{"provider":"email","providers":["email"]}'::jsonb
    ),
    updated_at = now()
  FROM target_users t
  WHERE u.email = t.email
  RETURNING u.id, u.email
),

all_users AS (
  SELECT id, email FROM updated_users
  UNION
  SELECT id, email FROM inserted_users
)

INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email),
  'email',
  u.email,
  now(),
  now(),
  now()
FROM all_users u
WHERE NOT EXISTS (
  SELECT 1
  FROM auth.identities i
  WHERE i.user_id = u.id AND i.provider = 'email'
);

-- ---------- Álbum + catálogo copiado del álbum ejemplo (...0001) ----------
INSERT INTO public.albums (id, name)
VALUES (
  '00000000-0000-4000-8000-000000000002'::uuid,
  'Mundial 2026 (álbum 2)'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stickers (album_id, code, name, country, type)
SELECT
  '00000000-0000-4000-8000-000000000002'::uuid,
  code,
  name,
  country,
  type
FROM public.stickers
WHERE album_id = '00000000-0000-4000-8000-000000000001'::uuid
ON CONFLICT (album_id, code) DO NOTHING;

INSERT INTO public.album_members (album_id, user_id)
SELECT '00000000-0000-4000-8000-000000000002'::uuid, id
FROM auth.users
WHERE email IN (
  'felipe@album.local',
  'guille@album.local',
  'jose@album.local',
  'lucia@album.local'
)
ON CONFLICT (album_id, user_id) DO NOTHING;

COMMIT;

-- Verificación rápida:
-- SELECT email, raw_user_meta_data->>'name' AS name FROM auth.users
-- WHERE email LIKE '%@album.local' ORDER BY email;
-- SELECT * FROM public.album_members WHERE album_id = '00000000-0000-4000-8000-000000000002';
