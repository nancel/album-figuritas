# Album figuritas (Mundial)

Aplicación web para llevar el control de un **álbum compartido** entre varias personas: mismas figuritas, mismas cantidades (todos ven y editan el mismo estado). No es marketplace ni red social.

## Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend / datos:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS)
- **Cliente:** `@supabase/supabase-js` + `@supabase/ssr` (sesión por cookies, sin backend propio)
- **Despliegue previsto:** Vercel

## Requisitos

- Node.js 22+ (recomendado; ver `package.json`)
- Una cuenta y proyecto en Supabase

## Puesta en marcha

### 1. Dependencias

```bash
npm install
```

### 2. Variables de entorno

Copiá el ejemplo y completá con los datos del proyecto Supabase (Settings → API):

```bash
cp .env.example .env.local
```

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave **anon** (solo esta en el cliente; no uses la `service_role` en la app) |
| `NEXT_PUBLIC_ALBUM_ID` | (Opcional) UUID del álbum si un usuario tiene varias membresías y querés fijar cuál usa la app |

### 3. Base de datos y seguridad

En el [SQL Editor](https://supabase.com/dashboard) de tu proyecto (o con la [CLI de Supabase](https://supabase.com/docs/guides/cli)), ejecutá la migración:

`supabase/migrations/20250406120000_initial_schema.sql`

Eso crea `albums`, `album_members`, `stickers` (catálogo por álbum), `album_sticker_quantities` (cantidades compartidas), políticas RLS e inserta un álbum de ejemplo y 60 figuritas (id de álbum de seed: `00000000-0000-4000-8000-000000000001`).

En **Authentication → Providers**, habilitá **Email**. Si querés evitar altas vía API, desactivá **Sign up** en la configuración de Email. **No hay registro en la app:** creá usuarios en Authentication (o vía SQL) y asocialos al álbum:

```sql
INSERT INTO public.album_members (album_id, user_id)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'UUID-DEL-USUARIO-EN-AUTH-USERS'
);
```

Los catálogos y altas de nuevos álbumes se gestionan manualmente en la base (sin pantalla en la app por ahora).

### 4. Desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000): solo **inicio de sesión** en `/`, panel en `/dashboard`, colección en `/stickers`.

### Build de producción

```bash
npm run build
npm start
```

## Modelo de datos (resumen)

- **`albums`:** cada álbum compartido (nombre, etc.).
- **`album_members`:** qué usuario (`auth.users`) participa en qué álbum.
- **`stickers`:** catálogo por `album_id` (no se edita desde la app con la anon key).
- **`album_sticker_quantities`:** `album_id` + `sticker_id` + `quantity ≥ 1`. **Sin fila para un cromo en ese álbum ⇒ falta** (en la UI se muestra cantidad 0).

## Documentación del repo

- [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) — objetivos y reglas de producto
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — estructura y convenciones
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) — fases de implementación

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run start` | Servidor tras `build` |
| `npm run lint` | ESLint |

## Licencia

Privado (revisa el propietario del repositorio si necesitás redistribuir o reutilizar el código).
