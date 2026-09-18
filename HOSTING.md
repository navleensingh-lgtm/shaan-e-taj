# Shaan-e-Taj — shaanetaj.com hosting

Current site is on **Wix**. This project replaces it with your full Next.js store.

## Fast path: Git → Vercel → shaanetaj.com

Use **work.navleensingh@gmail.com** on Vercel, import GitHub repo, add domain.

**Full click-by-click guide:** [docs/VERCEL-SHAANETAJ.md](docs/VERCEL-SHAANETAJ.md)

1. https://vercel.com → login **work.navleensingh@gmail.com**
2. Import **navleensingh-lgtm/shaan-e-taj**
3. Add domains **shaanetaj.com** + **www**
4. Point DNS at registrar to Vercel (remove Wix DNS)

## 1. GitHub

**Code is pushed (private):**  
https://github.com/workpuneetkumar-sketch/shaan-e-taj

### Move repo to Navleen (required)

```powershell
gh auth login
# Login as GitHub user: navleen

gh auth switch -u navleen
gh auth setup-git
```

On GitHub: **shaan-e-taj** → Settings → **Transfer ownership** → `navleen`

Or run: `powershell -File scripts/complete-setup.ps1` after Navleen login.

### Delete old repos (Cursor account)

Open https://github.com/workpuneetkumar-sketch/zyoris/settings → Delete  
Open https://github.com/workpuneetkumar-sketch/zyoris-frontend/settings → Delete  

(CLI needs `gh auth refresh -h github.com -s delete_repo` in browser first.)

## 2. VPS (recommended — website + API + database)

You need a small VPS (Hostinger, DigitalOcean, AWS Lightsail, etc.) with:

- Ubuntu 22+
- Ports **80** and **443** open
- Docker installed

On the server:

```bash
git clone https://github.com/navleen/shaan-e-taj.git
cd shaan-e-taj
cp .env.example .env
nano .env   # fill production keys
```

Set in `.env`:

- `POSTGRES_PASSWORD` (strong password)
- `NEXTAUTH_SECRET`, `INTERNAL_API_SECRET`
- `OPENAI_API_KEY`, `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_API_URL=https://api.shaanetaj.com`
- `NEXTAUTH_URL=https://shaanetaj.com`
- Razorpay, R2, Telegram as needed

Deploy:

```bash
docker compose -f deploy/docker-compose.prod.yml up -d --build
docker compose -f deploy/docker-compose.prod.yml exec api npx dotenv -e ../../.env -- prisma db push
docker compose -f deploy/docker-compose.prod.yml exec api npx dotenv -e ../../.env -- tsx packages/database/prisma/seed.ts
```

## 3. Domain DNS (shaanetaj.com)

In your domain registrar (where you bought shaanetaj.com), **remove Wix DNS** and add:

| Type | Name | Value |
|------|------|--------|
| A | `@` | Your VPS IP address |
| A | `www` | Same VPS IP |
| A | `api` | Same VPS IP |

Wait 15–60 minutes. Caddy will get free HTTPS certificates automatically.

## 4. Wix removal

1. Domain registrar → point DNS to VPS (step 3).
2. Wix dashboard → disconnect custom domain (optional after DNS propagates).

## 5. Production checklist

- [ ] WhatsApp number in `.env`
- [ ] Admin password changed from `admin123`
- [ ] Razorpay live keys (if taking online pay)
- [ ] Telegram bot token for team uploads
- [ ] Test https://shaanetaj.com and https://api.shaanetaj.com/health
