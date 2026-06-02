# Shaan-e-Taj — shaanetaj.com hosting

Current site is on **Wix**. This project replaces it with your full Next.js store.

## 1. GitHub — use Navleen account only

Right now `gh` is logged in as **workpuneetkumar-sketch**. Switch to **navleen**:

```powershell
gh auth login
# Browser → login as Navleen → authorize

gh auth switch -u navleen
gh auth setup-git
```

Create **one private** repo and push:

```powershell
cd C:\Users\Puneet\Projects\shaan-e-taj
git add .
git commit -m "Shaan-e-Taj production website"
gh repo create shaan-e-taj --private --source=. --remote=origin --push
```

Extra repos on the old Cursor account (`zyoris`, `zyoris-frontend`) should be deleted (see below).

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
