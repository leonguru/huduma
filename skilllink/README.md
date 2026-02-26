# Skilllink

React Native (Expo) app to connect clients with electricians. Built with TypeScript, Expo Router, NativeWind, Zustand, and Supabase.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set your Supabase URL and anon key:

   ```bash
   cp .env.example .env
   ```

   Create a project at [supabase.com](https://supabase.com), then run the schema in the SQL Editor:

   - Open `supabase/migrations/001_initial_schema.sql` and run its contents in the Supabase SQL Editor.

3. **Run the app**

   ```bash
   npx expo start
   ```

   Use Expo Go on your device or an emulator to open the app.

   From the repo root (`e:\nebula`): `npm start` (runs the app in tunnel mode by default).

### If the app stays on the Expo Go loading screen

The JS bundle may not be reaching the device. Try in order:

1. **Tunnel** – From `skilllink`: `npm run start:tunnel`. Wait for the tunnel URL/QR, then open that in Expo Go (not the LAN URL).
2. **Same network** – Phone and PC on the same Wi‑Fi; avoid VPNs. Use the LAN URL/QR from `npm run start:lan`.
3. **Firewall** – Allow Node/Metro (e.g. port 8081/8082) in Windows Firewall if using LAN.
4. **Emulator** – Run on Android emulator: `npm run android` (or `npx expo start` then press `a`). **Requires:** Android Studio with Android SDK installed and `ANDROID_HOME` set (e.g. `C:\Users\YourName\AppData\Local\Android\Sdk`). If you see "Failed to resolve the Android SDK path" or "'adb' is not recognized", install [Android Studio](https://developer.android.com/studio), complete SDK setup, then set `ANDROID_HOME` in System Environment Variables and add `%ANDROID_HOME%\platform-tools` to `PATH`.
5. **Terminal** – When you open the project in Expo Go, check the Expo/Metro terminal for red errors (e.g. bundle failed, transform error).

Splash behavior in Expo Go can be unreliable; for consistent splash and loading, use a development or production build.

## Project structure

- `app/` – Expo Router screens and layouts (auth, client, technician, shared groups)
- `components/` – Reusable UI and feature components
- `hooks/` – useAuth, useTechnicians, useChat
- `lib/` – Supabase client and utils
- `store/` – Zustand auth store
- `types/` – Shared TypeScript types
- `constants/` – Colors, spacing, categories
- `supabase/migrations/` – SQL schema and RLS for Supabase

## Features

- **Auth**: Email/password sign up, login, role selection (client or technician)
- **Client**: Browse technicians, search/filter, view profile, post job, view bookings, chat per job
- **Technician**: Dashboard, accept job requests, edit profile, earnings placeholder
- **Shared**: Chat (realtime), notifications placeholder, settings and logout
