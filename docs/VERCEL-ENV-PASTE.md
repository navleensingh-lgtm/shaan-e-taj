# Vercel → Project → Settings → Environment Variables (Production)

Copy-paste these in the Vercel dashboard for **navleensingh-lgtm/shaan-e-taj**:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://shaanetaj.com` |
| `NEXTAUTH_URL` | `https://shaanetaj.com` |
| `NEXT_PUBLIC_API_URL` | `https://api.shaanetaj.com` (update when API is live) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your WhatsApp with country code, e.g. `9198XXXXXXXX` |
| `DATABASE_URL` | Postgres URL (Vercel Postgres / Neon / Render DB) |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` or any long random string |

Then **Redeploy** the latest deployment.

Domains: add `shaanetaj.com` and `www.shaanetaj.com` under **Domains**.
