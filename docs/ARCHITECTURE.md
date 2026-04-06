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
  login/

components/
  StickerCard.tsx
  StickerGrid.tsx
  ProgressBar.tsx

lib/
  supabase/
    client.ts
    server.ts

services/
  stickers.ts
  auth.ts

types/

---

## 🔌 Supabase Integration

We use the official SDK:

@supabase/supabase-js

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

- Supabase Auth (email + password)
- Session handled by Supabase

Always validate user:

const { data: { user } } = await supabase.auth.getUser()

---

## 🛡️ Security (RLS)

Row Level Security is REQUIRED.

Rule:

auth.uid() = user_id

This ensures:
- Users only access their own data
- No backend needed for authorization

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