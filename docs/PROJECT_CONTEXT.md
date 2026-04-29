# 🏆 Project Context - Sticker Album App

## 🎯 Goal
Build a web app to track a World Cup sticker album **shared by several users**.

Users can:
- Track owned stickers (per shared album)
- Identify missing stickers
- Detect duplicates
- View overall progress

---

## 🧠 Core Concept

**One album** (row in `albums`) has a **sticker catalog** and **shared quantities**: every member of that album sees and updates the **same** counts. Missing stickers are represented by **no row** in the quantity table (or effective quantity 0 in the UI).

The app is NOT a marketplace.
The app is NOT social (for now).

It is a **shared tracking tool** for a small group working on the same physical album.

---

## 🧱 Tech Stack

- Frontend: Next.js (App Router)
- Styling: Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth + RLS)
- Deployment: Vercel

---

## 🏗️ Architecture Decision

We DO NOT use a custom backend.

We rely on:
- Supabase client directly from frontend
- Row Level Security (RLS) for access control

This is intentional to:
- reduce complexity
- speed up development

---

## 📊 Data Model

### albums
- id (uuid)
- name (text)

### album_members
- album_id (uuid)
- user_id (uuid, references auth.users)
- Primary key (album_id, user_id)

### stickers (catalog per album)
- id (uuid)
- album_id (uuid)
- code (text), name (text), country (text, nullable), type (text)
- Unique (album_id, code)

### album_sticker_quantities
- id (uuid)
- album_id (uuid)
- sticker_id (uuid)
- quantity (int, ≥ 1 only; **no row** for that sticker in that album → missing)

---

## 🔐 Security Model

- Only **authenticated** users who appear in `album_members` for an album can read that album’s stickers and quantities, and can insert/update/delete quantity rows for that album.
- Catalog rows (`stickers`) are not edited from the app (managed in DB).
- New users, albums, and memberships are **not** created from the app in the MVP (manual / Supabase dashboard).

---

## 🚫 Non-goals (for MVP)

- No trading system
- No notifications
- No UI to create albums or invite users (data entry is manual in the database)
- No public self-service registration (login only for accounts created in Supabase)
- No real-time sync

---

## 🧠 UX Principles

- Fast interactions (few clicks)
- Mobile-friendly
- Visual feedback (missing / owned / duplicate)
- Simple and intuitive (kid-friendly)

---

## ⚡ Key Behaviors

- quantity = 0 (no row in `album_sticker_quantities`) → missing
- quantity = 1 → owned
- quantity > 1 → duplicate
