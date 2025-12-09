# PourDecisions - Drink. Rate. Repeat.

A personal wine tasting notes app with Google authentication and cloud sync.

## Features

- 🍷 Track wine tastings with WSET-style notes
- 🔐 Google OAuth authentication
- ☁️ Cloud sync via Supabase (data syncs across devices)
- 📱 Works on mobile and desktop

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** and run the SQL from `supabase/schema.sql`
3. Go to **Authentication** → **Providers** → Enable **Google**
4. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase Google provider settings

### 2. Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

### 3. Deploy to GitHub Pages

1. **Add Repository Secrets** (Settings → Secrets → Actions):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. **Enable GitHub Pages**:
   - Settings → Pages → Source: "GitHub Actions"

3. **Configure Custom Domain** (optional):
   - Add CNAME DNS record: `pourdecisions` → `trentcurrie.github.io`
   - Settings → Pages → Add custom domain

4. **Update Google OAuth redirect URIs**:
   - Add `https://pourdecisions.trentcurrie.com` to authorized origins
   - Add `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback` as redirect URI

Your app will be available at: `https://pourdecisions.trentcurrie.com/`
