# PrimeFix Solutions website

React + Vite front end, PHP (PHPMailer) back end for forms.

## Local development
```bash
npm install
cp .env.example .env              # VITE_API_BASE=/api
cp server/.env.example server/.env  # fill in SMTP_USER, SMTP_PASS, ...
npm start                         # Vite (5173) + PHP built-in server (8000, needs php-cli)
```
Vite proxies `/api/*` to the PHP server, so forms work locally.

## Backend (server/)
| Endpoint | Used by | Result |
|---|---|---|
| `send-mail.php` | contact form, booking, cost estimator, maintenance plans, service explorer, chatbot | emails you the request; emails the visitor a confirmation if they gave an email |
| `subscribe.php` | newsletter | saves to `storage/subscribers.csv` (deduped), emails you, sends a welcome email |
| `submit-review.php` | review modal | queues in `storage/pending-reviews.json`, emails you a ready-to-paste JSON snippet for `src/data/reviews.json` |

All endpoints: JSON in/out, honeypot, per-IP rate limiting, input length caps, HTML-escaped emails. A failure always returns `{ok:false,error}` and the site shows it; it never pretends a request was sent.

**Secrets live only in `server/.env` (or real environment variables), never in code.** Required: `SMTP_USER`, `SMTP_PASS`. Gmail needs an app password. Needs PHP 7.4+ with mbstring and openssl.

## Deploying
**Option A, one PHP host (simplest, no CORS):** run `npm run build`, upload the *contents* of `dist/` to `public_html/`, and upload `server/` (including `vendor/`, `.htaccess`, `storage/`, and your `.env`) to `public_html/api/`. Build with `VITE_API_BASE=/api`. Confirm `https://yourdomain.com/api/.env` and `/api/storage/subscribers.csv` return 403/404.

**Option B, static host (Vercel/Netlify) + PHP elsewhere:** Vercel cannot run PHP. Host `server/` on PHP hosting, build with `VITE_API_BASE=https://api.yourdomain.com`, and set `ALLOWED_ORIGIN=https://yourdomain.com` in `server/.env`.

Redirect HTTP to HTTPS at your host/CDN.

## Before launch checklist
- [ ] Replace placeholder phone `(555) 010-2000` / email: `src/config/site.js`, `server/.env` (`BUSINESS_PHONE`), `public/primefix-solutions.vcf`, `index.html` (JSON-LD + noscript)
- [ ] Verify business address, hours and service area in the JSON-LD in `index.html`; `src/utils/booking.js` hours must match
- [ ] Only keep claims you can back up ("Licensed & fully insured", "500+ properties", reviews)
- [ ] Replace AI-generated hero/portfolio imagery with real project photos if they are not real work
- [ ] Revoke the old Gmail app password that was in the earlier `config.php`
- [ ] Send a test of every form on the live site and confirm the emails arrive
- [ ] Submit `https://yourdomain.com/sitemap.xml` to Google Search Console
