# 🏆 Project Context - Sticker Album App

## 🎯 Goal
Build a web app to track a World Cup sticker album shared between users.

Users can:
- Track owned stickers
- Identify missing stickers
- Detect duplicates
- View overall progress

---

## 🧠 Core Concept

Each user manages their own collection, but the goal is to complete a shared album.

The app is NOT a marketplace.
The app is NOT social (for now).

It is a **personal + shared tracking tool**.

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

### stickers (catalog)
- id (uuid)
- code (text)
- country (text)
- player_name (text)

### user_stickers
- id (uuid)
- user_id (uuid)
- sticker_id (uuid)
- quantity (int)

---

## 🔐 Security Model

- Users can ONLY access their own data
- Enforced via Supabase RLS

---

## 🚫 Non-goals (for MVP)

- No trading system
- No notifications
- No multi-group sharing
- No real-time sync

---

## 🧠 UX Principles

- Fast interactions (few clicks)
- Mobile-friendly
- Visual feedback (missing / owned / duplicate)
- Simple and intuitive (kid-friendly)

---

## ⚡ Key Behaviors

- quantity = 0 → missing
- quantity = 1 → owned
- quantity > 1 → duplicate