# shaanetaj.com on Vercel (work.navleensingh@gmail.com)

Git repo is ready: **https://github.com/navleensingh-lgtm/shaan-e-taj**  
Build config is in root `vercel.json` — no extra setup in repo.

## Step 1 — Vercel account (correct email)

1. Open https://vercel.com/signup  
2. Sign up / log in with **work.navleensingh@gmail.com**  
3. When asked, connect **GitHub** and authorize **navleensingh-lgtm** (same org as repo).

## Step 2 — Import from Git (recommended)

1. Vercel Dashboard → **Add New…** → **Project**  
2. Import **`navleensingh-lgtm/shaan-e-taj`**  
3. Framework: **Next.js** (auto-detected)  
4. Root Directory: **`.`** (repo root — leave default)  
5. Build settings — use repo `vercel.json` (do not override unless build fails):

   - Install: `npm install --include=optional`  
   - Build: `npm run build -w @shaan-e-taj/database && npm run build -w @shaan-e-taj/web`  
   - Output: `apps/web/.next`

6. **Environment Variables** (Production):

   | Name | Example |
   |------|---------|
   | `DATABASE_URL` | `postgresql://user:pass@host:5432/shaanetaj` |
   | `NEXT_PUBLIC_API_URL` | `https://api.shaanetaj.com` (or Render API URL later) |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `91XXXXXXXXXX` |
   | `NEXTAUTH_SECRET` | long random string |
   | `NEXTAUTH_URL` | `https://shaanetaj.com` |

7. Click **Deploy**.  
   Every `git push` to `main` will auto-deploy.

## Step 3 — Custom domain shaanetaj.com

1. Project → **Settings** → **Domains**  
2. Add: `shaanetaj.com` and `www.shaanetaj.com`  
3. Vercel shows DNS records — copy them.

### At your domain registrar (where you bought shaanetaj.com)

**Remove old Wix DNS** (A/CNAME pointing to Wix).

**Add Vercel records** (typical):

| Type | Name | Value |
|------|------|--------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

(Vercel dashboard may show slightly different values — **use what Vercel shows**.)

4. Wait 15–60 minutes for DNS.  
5. Vercel will issue **HTTPS** automatically.

## Step 4 — Old wrong Vercel account

On the **personal** Vercel account (`puneets-projects`):

- Delete project **shaan-e-taj** (optional, avoids duplicate).

On your PC:

```powershell
cd C:\Users\Puneet\Projects\shaan-e-taj
npx vercel logout
Remove-Item .vercel -Recurse -Force -ErrorAction SilentlyContinue
```

Do **not** run `vercel deploy` from CLI until logged in as **work.navleensingh@gmail.com**, or use **Git-only deploy** from dashboard (easiest).

## What runs where

| Service | Host |
|---------|------|
| Website (shaanetaj.com) | **Vercel** ← this guide |
| API + PostgreSQL + Telegram bot | **Render** (`render.yaml`) or VPS — see `HOSTING.md` |

Website on Vercel works without API; products need API/DB or static fallbacks until API is hosted.

## Checklist

- [ ] Vercel login: work.navleensingh@gmail.com  
- [ ] GitHub import: navleensingh-lgtm/shaan-e-taj  
- [ ] Env vars set  
- [ ] Domains: shaanetaj.com + www  
- [ ] DNS updated (Wix removed)  
- [ ] https://shaanetaj.com opens  
