# Neon database connect — 5 minutes

## Step 1 — Copy connection string

Neon dashboard → your project → **Connect** → **Connection string**

- Choose: **PostgreSQL**
- Branch: **production** (or main)
- Copy the full string. It looks like:

```
postgresql://neondb_owner:YOUR_PASSWORD@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Click **Show password** if needed.

## Step 2 — Paste in `.env`

Open `C:\Users\Puneet\Projects\shaan-e-taj\.env` and replace the old line:

```env
DATABASE_URL="postgresql://shaanetaj:shaanetaj_dev@localhost:5432/shaanetaj"
```

with your Neon string (keep quotes):

```env
DATABASE_URL="postgresql://neondb_owner:...@ep-....neon.tech/neondb?sslmode=require"
```

## Step 3 — Create tables (run once)

PowerShell:

```powershell
cd C:\Users\Puneet\Projects\shaan-e-taj
npm run db:generate
npm run db:migrate
npm run db:seed
```

If `migrate` asks for a migration name, type: `init`

Alternative if migrate fails:

```powershell
cd packages\database
npx dotenv -e ../../.env -- npx prisma db push
npx dotenv -e ../../.env -- npx tsx prisma/seed.ts
```

## Step 4 — Vercel (website)

1. https://vercel.com → **navleen-s-projects** → **shaan-e-taj**
2. **Settings** → **Environment Variables**
3. Edit `DATABASE_URL` → paste **same Neon string**
4. **Deployments** → **Redeploy** latest

## Step 5 — API (when Render is set up)

Same `DATABASE_URL` on Render API service.

Set `NEXT_PUBLIC_API_URL` on Vercel to your API URL so catalog loads products.

## Done

- Sample products: after `db:seed`
- Real products: Telegram bot → photo → `/publish`
