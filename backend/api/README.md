# Consoltech API (NestJS)

Backend for the product catalog, admin panel, and warranty registration form.

## Run locally

```bash
npm ci
npm run build
npm start          # node dist/main.js — same command production uses
```

With no configuration the API stores everything in local JSON files
(`data/*.json`) and saves invoice uploads to `uploads/` (served at
`/uploads/...`). This is the dev fallback — fine locally, but on Render the
disk is wiped on every restart, so production must use Supabase.

## Production storage (Supabase) — required on Render

1. Run `supabase/001_init.sql` and `supabase/002_backend_api_alignment.sql`
   in the Supabase SQL Editor (both are idempotent, safe to re-run).
2. In the Render service, set:

| Variable | Value |
|---|---|
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_KEY` | Supabase → Project Settings → API → `service_role` key (secret!) |

When both are set, records go to Supabase tables and invoice files go to the
private `warranty-invoices` storage bucket (the admin panel views them through
short-lived signed URLs). Without them, the JSON fallback is used and **data
is lost on every Render restart**.

## Optional environment variables

| Variable | Purpose |
|---|---|
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | Enable the warranty notification email to sales |
| `SMTP_FROM_EMAIL` / `SMTP_FROM_NAME` / `SALES_EMAIL` | Email addresses (defaults point at consoltech.co.il) |
| `JWT_SECRET_KEY` | Admin JWT signing key (override the dev default in production) |
| `PORT` | Listen port (Render sets this automatically) |

## Deploys

Frontend deploys to GitHub Pages automatically on every push to `main`
(`.github/workflows/deploy.yml`). The backend can auto-deploy too:
create a Deploy Hook in Render (service → Settings → Deploy Hook) and add
its URL as a GitHub repo secret named `RENDER_DEPLOY_HOOK_URL` —
`.github/workflows/deploy-backend.yml` then triggers Render on every push
to `main` that touches `backend/api/`.
