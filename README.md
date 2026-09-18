# Shaan-e-Taj — Full Luxury Couture Platform

Complete e-commerce system: customer website, Telegram AI upload, one-click publish, WhatsApp + Razorpay ordering, AI search, admin dashboard, customer accounts, and optional Instagram/Facebook auto-posting.

## Features (all included)

- **Customer site** — Ivory/rose gold theme, all collection pages, product detail, cart, checkout
- **Telegram bot** — Photo → AI enhance/metadata → `/publish` → live catalog
- **AI** — Vision product generation, semantic search, social captions
- **WhatsApp** — Pre-filled order messages on every product
- **Razorpay** — Online payment (mock mode without keys)
- **Accounts** — Register/login, wishlist, orders, saved measurements & addresses
- **Admin** — Sales, visitors, WhatsApp clicks, conversion, settings, stitching charges
- **Images** — Sharp pipeline + Cloudflare R2 (falls back to processed buffers without R2)
- **Social** — Auto Instagram/Facebook post on publish when enabled in admin

## Quick start

See **[SETUP.md](SETUP.md)** for step-by-step instructions (including database without Docker).

```powershell
cd C:\Users\Puneet\Projects\shaan-e-taj
copy .env.example .env
# Edit .env, then:
npm install
npm run db:generate
npm run db:migrate
npm run db:seed

npm run dev          # :3000
npm run dev:api      # :4000
npm run dev:bot      # Telegram
```

## Architecture

```
apps/web/           Next.js storefront + NextAuth
apps/api/           Express API (products, orders, admin, AI pipeline)
apps/telegram-bot/  Grammy upload bot
packages/database/  Prisma + PostgreSQL
```

Full diagram: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Tech stack

Next.js · Node.js · PostgreSQL · Cloudflare R2 · OpenAI · Telegram · Razorpay · Docker
