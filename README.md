# PourDecisions - Drink. Rate. Repeat.

A personal wine tasting notes app with AI-powered insights.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate your password hash:
   ```bash
   node scripts/generate-password-hash.js your-password-here
   ```

3. Create a `.env` file with your credentials:
   ```
   VITE_AUTH_PASSWORD_SIMPLE=your_base64_password
   VITE_AUTH_PASSWORD_HASH=your_sha256_hash
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

## Deploy to GitHub Pages

This app is configured for automatic deployment via GitHub Actions.

### Setup Steps:

1. **Enable GitHub Pages** in your repository:
   - Go to Settings → Pages
   - Under "Build and deployment", select "GitHub Actions"

2. **Add Repository Secrets**:
   - Go to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VITE_AUTH_PASSWORD_SIMPLE` - Base64 encoded password
     - `VITE_AUTH_PASSWORD_HASH` - SHA-256 hash of password
     - `VITE_GEMINI_API_KEY` - Your Gemini API key (optional)

3. **Generate password hashes**:
   ```bash
   node scripts/generate-password-hash.js your-password-here
   ```

4. **Push to main branch** - The GitHub Action will automatically build and deploy.

Your app will be available at: `https://pourdecisions.trentcurrie.com/`

### Custom Domain

This app is configured to use `pourdecisions.trentcurrie.com`.

DNS setup:
1. Add a **CNAME DNS record**: `pourdecisions` → `trentcurrie.github.io`
2. Wait for DNS propagation (can take up to 24 hours)
3. Enable HTTPS in GitHub Pages settings once the domain is verified
