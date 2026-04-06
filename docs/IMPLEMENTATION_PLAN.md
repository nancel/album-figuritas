# 🚀 Implementation Plan

## 🧭 Strategy

Build step by step.

Do NOT implement everything at once.

---

## 🟢 Phase 1 - Setup

- Install supabase-js
- Create Supabase client
- Add environment variables
- Connect app to Supabase

DONE when:
Project can connect to Supabase

---

## 🟡 Phase 2 - Authentication

- Create login page
- Implement login/signup
- Persist session
- Protect routes

DONE when:
User can login and access dashboard

---

## 🟠 Phase 3 - Database

- Create tables:
  - stickers
  - user_stickers
- Insert sticker catalog
- Configure RLS

DONE when:
User can query their own data only

---

## 🔵 Phase 4 - Read Data

- Remove mock data
- Fetch user stickers from Supabase
- Map data to UI components

DONE when:
UI shows real data

---

## 🟣 Phase 5 - Write Data

- Implement increment/decrement buttons
- Update quantity in database
- Sync UI state

DONE when:
User can update sticker quantities

---

## 🟤 Phase 6 - Dashboard

- Calculate:
  - total stickers
  - missing stickers
  - duplicate stickers
- Render progress bar

DONE when:
Dashboard shows real stats

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
- User sees stickers
- User updates quantities
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