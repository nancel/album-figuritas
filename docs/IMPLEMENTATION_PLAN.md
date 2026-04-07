# 🚀 Implementation Plan

## 🧭 Strategy

Build step by step.

Do NOT implement everything at once.

---

## 🟢 Phase 1 - Setup

- Install supabase-js + @supabase/ssr
- Create Supabase client
- Add environment variables
- Connect app to Supabase

DONE when:
Project can connect to Supabase

---

## 🟡 Phase 2 - Authentication

- Create login page (sign-in only; no public registration)
- Persist session
- Protect routes

DONE when:
A user created in Supabase Auth can log in and access the dashboard

---

## 🟠 Phase 3 - Database

- Create tables:
  - `albums`, `album_members`, `stickers` (per album), `album_sticker_quantities`
- Insert sticker catalog (seed) tied to a sample album
- Configure RLS (membership-based access)

DONE when:
Members of an album can read/update shared quantities only for that album

---

## 🔵 Phase 4 - Read Data

- Remove mock data
- Resolve active album (`album_members`, optional `NEXT_PUBLIC_ALBUM_ID`)
- Fetch catalog + quantity rows from Supabase
- Map data to UI components

DONE when:
UI shows real shared data

---

## 🟣 Phase 5 - Write Data

- Implement increment/decrement buttons
- Update `album_sticker_quantities` (insert/update/delete; no row = missing)
- Sync UI state

DONE when:
Any member can update quantities and others see the same state

---

## 🟤 Phase 6 - Dashboard

- Calculate:
  - total stickers
  - missing stickers
  - duplicate stickers
- Render progress bar

DONE when:
Dashboard shows real stats for the shared album

---

## ⚫ Phase 7 - Polish

- Add loading states
- Add error handling
- Improve mobile UX

---

## 🧠 Rules for AI (Cursor / Codex)

- Do NOT change architecture
- Do NOT add backend
- Always use Supabase client
- Keep code simple
- Avoid unnecessary abstractions

---

## 🧪 Definition of Done

- User logs in
- User sees stickers for an album they belong to
- User updates quantities (shared with other members)
- Missing and duplicates visible
- Progress is calculated

---

## 🚫 Anti-patterns

- Creating API routes without need
- Overcomplicating state management
- Adding features outside MVP
- Premature optimization

---

## 💡 Guideline

If something feels complex:
it is probably not needed for the MVP
