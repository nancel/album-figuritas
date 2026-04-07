# Album figuritas (Mundial)

Aplicación web para llevar el control de un álbum de figuritas: qué tenés, qué falta y cuántos duplicados llevás. Pensada como herramienta personal de seguimiento (no es marketplace ni red social).

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

### 3. Base de datos y seguridad

En el [SQL Editor](https://supabase.com/dashboard) de tu proyecto (o con la [CLI de Supabase](https://supabase.com/docs/guides/cli)), ejecutá la migración:

`supabase/migrations/20250406120000_initial_schema.sql`

Eso crea las tablas `stickers` (catálogo de lectura pública) y `user_stickers` (filas por usuario con RLS), e inserta el catálogo inicial de ejemplo.

En **Authentication → Providers**, habilitá **Email** (y ajustá confirmación por correo según prefieras).

### 4. Desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000): inicio de sesión / registro en `/`, panel en `/dashboard`, colección en `/stickers`.

### Build de producción

```bash
npm run build
npm start
```

## Modelo de datos (resumen)

- **Catálogo `stickers`:** código, país, jugador, etc. Lectura pública; no se modifica desde la app con la anon key.
- **`user_stickers`:** `user_id`, `sticker_id`, `quantity ≥ 1`. **Si no hay fila para un cromo, se considera que falta** (`quantity` efectivo 0 en la UI).

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
