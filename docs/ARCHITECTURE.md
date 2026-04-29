# 🏗️ Architecture Guide

## 🧩 Overview

The frontend communicates directly with Supabase using the official client.

There is NO custom backend in this project.

---

## 🧱 Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase (Auth + PostgreSQL + RLS)
- Vercel (deployment)

---

## 📁 Project Structure

app/
  dashboard/
  stickers/
  page.tsx (login)

components/
  StickerCard.tsx
  StickerGrid.tsx
  ProgressBar.tsx

lib/
  supabase/
    client.ts
    server.ts
  album.ts (resolve active album for the logged-in user)

services/
  stickers.ts

types/

---

## 🔌 Supabase Integration

We use the official SDK:

@supabase/supabase-js
@supabase/ssr (Next.js: browser + server clients, middleware session refresh)

### Client usage

- Used directly in React components
- Handles authentication and database queries

---

## 📡 Data Strategy

- Reads: done directly from Supabase
- Writes: done directly from Supabase
- No API routes required

---

## 🔐 Authentication

- Supabase Auth (email + password), **sign-in only** in the app (no sign-up UI)
- Login UI uses `usuario + contraseña` and maps username to email (`usuario@NEXT_PUBLIC_AUTH_EMAIL_DOMAIN`)
- New users are created outside the app (Supabase Auth UI / SQL / admin)
- Session handled by Supabase (`@supabase/ssr`)

Always validate user:

const { data: { user } } = await supabase.auth.getUser()

---

## 🛡️ Security (RLS)

Row Level Security is REQUIRED.

Rules (summary):

- **`album_members`**: a user can read rows where `user_id = auth.uid()` (their memberships).
- **`albums`**, **`stickers`**, **`album_sticker_quantities`**: access only if there is a membership row linking `auth.uid()` to that `album_id`.
- Quantity changes are **shared** for all members of the album (same rows).

Do NOT expose `service_role` in the client.

---

## ⚠️ Rules

- Do NOT add a custom backend
- Do NOT expose service_role key
- Keep logic simple
- Use Supabase directly

---

## 🚀 Future (Not part of MVP)

- Server Actions
- Edge Functions
- Custom backend (only if needed)
