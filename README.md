# SkillLink – Local Services Marketplace (MVP)

SkillLink is a React Native (Expo) app that connects clients with local electricians.  
It uses Supabase for auth, database, storage and realtime, with a modern TypeScript + Expo Router + NativeWind stack.

## Features

- Client side:
  - Email/password auth with role selection (client/technician)
  - Browse & search electricians by rating, price, and availability
  - Technician profiles with portfolio, reviews, and ratings
  - Post job requests, track bookings, and chat in real time
  - Leave reviews with detailed sub-ratings
- Technician side:
  - Dashboard for incoming job requests
  - Accept/complete jobs, edit profile, manage availability
  - Realtime chat and notifications

---

## 1. Setup

### Prerequisites

- Node.js 18+
- Expo CLI (`npx expo` is fine)
- Supabase account (`https://supabase.com`)

### Install dependencies

```bash
cd skilllink
npm install
```

### Supabase project setup

1. Create a new project in the Supabase dashboard.
2. In the SQL Editor, run:
   - `supabase/migrations/001_initial_schema.sql`
   - (Optional) `supabase/seed.sql` to load sample electricians, jobs, and reviews.
3. In the Supabase dashboard, copy:
   - Project URL
   - anon public key

### Environment variables

In `skilllink/.env`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 2. Running the app

From `skilllink/`:

```bash
npx expo start
```

Then:

- **iOS simulator**: press `i` in the Expo CLI (requires Xcode & iOS simulator).
- **Android emulator**: press `a` in the Expo CLI (requires Android Studio & an emulator).
- **Physical device**: use the Expo Go app and scan the QR code.

---

## 3. Folder structure

All app code lives in `skilllink/`:

- `app/`
  - `(auth)/` – onboarding, welcome, login, register
  - `(client)/` – client home, search, job post, bookings, client profile
  - `(technician)/` – technician dashboard, job requests, profile
  - `(shared)/` – chat, notifications, messages, settings, leave-review
  - `_layout.tsx` – root layout (auth routing, splash, notifications)
- `components/`
  - `ui/` – Button, Card, Avatar, Input, etc.
  - `TechnicianCard.tsx`, `JobCard.tsx`, `RatingStars.tsx`, `ReviewCard.tsx`, `ChatBubble.tsx`
- `hooks/`
  - `useAuth.ts`, `useTechnicians.ts`, `useChat.ts`
- `lib/`
  - `supabase.ts` – Supabase client (with AsyncStorage auth)
  - `notifications.ts` – Expo notifications + token registration
  - `utils.ts` – formatting helpers (currency, dates, time ago, debounce)
- `store/`
  - `authStore.ts` – global auth/session state
  - `notificationStore.ts` – in-app notifications
- `types/` – shared TS models (Profile, TechnicianProfile, JobRequest, Review, Message)
- `constants/` – theme colors, app name, service categories
- `supabase/`
  - `migrations/001_initial_schema.sql` – schema + RLS + triggers
  - `seed.sql` – sample data for local testing

---

## 4. Adding a new service category later

The MVP ships with a single category: `electrician`. To add more, e.g. `plumber`:

1. **Database**:
   - Update `technician_profiles.category` to reflect the new type (e.g. set `category = 'plumber'` for some rows).
2. **Constants** (`skilllink/constants/index.ts`):

   ```ts
   export const SERVICE_CATEGORIES = ["electrician", "plumber"] as const;
   ```

3. **Filters & UI**:
   - Update any category chips or filters (search screen, technician filters) to include the new category string.
4. **Discovery logic**:
   - `useTechnicians` currently filters for `category = 'electrician'`.  
     You can either:
     - Add a `category` parameter to fetch different categories, or
     - Remove the hard-coded filter and control it from the calling screen.



