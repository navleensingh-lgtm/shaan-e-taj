# Shaan-e-Taj — Setup (Full Product)

## 1. Environment

```powershell
cd C:\Users\Puneet\Projects\shaan-e-taj
copy .env.example .env
```

Edit `.env` and set at minimum:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random string (`openssl rand -base64 32`) |
| `INTERNAL_API_SECRET` | Same idea — bot + API internal calls |
| `OPENAI_API_KEY` | AI catalog + search + captions |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | e.g. `919876543210` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First admin login |

Optional but recommended for full features:

- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_ADMIN_CHAT_IDS`
- `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`
- `R2_*` for Cloudflare image storage
- `META_*` for Instagram/Facebook auto-post

## 2. Database (PostgreSQL)

### Option A — Docker Desktop

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/), then:

```powershell
npm run docker:up
```

### Option B — Free cloud DB (no Docker)

1. Create a free Postgres database at [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the connection string into `.env` as `DATABASE_URL`.

## 3. Install & migrate

```powershell
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 4. Run everything

**Terminal 1 — Website**

```powershell
npm run dev
```

**Terminal 2 — API**

```powershell
npm run dev:api
```

**Terminal 3 — Telegram bot**

```powershell
npm run dev:bot
```

| Service | URL |
|---------|-----|
| Storefront | http://localhost:3000 |
| API | http://localhost:4000 |
| Admin | http://localhost:3000/admin |

Default admin (from seed): `admin@shaanetaj.com` / `admin123` (change in `.env` before seed).

## 5. Telegram workflow

1. Create bot via [@BotFather](https://t.me/BotFather) → paste token in `.env`.
2. Send your Telegram user ID in `TELEGRAM_ADMIN_CHAT_IDS`.
3. Send a suit photo → AI processes → `/publish` → live on website.

## Troubleshooting

- **`docker` not recognized** — Use Option B (Neon) for database.
- **Empty catalog** — Run `npm run db:seed` and ensure API is running.
- **Telegram publish fails** — Set `INTERNAL_API_SECRET` in `.env` (same value for API and bot).
