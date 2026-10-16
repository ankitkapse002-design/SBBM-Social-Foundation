# Production Deployment & Hosting Guide
### SBBM Social Foundation & Vyenkatesh Ashram

This guide provides step-by-step instructions for deploying the full-stack application to production.

---

## 1. Production Build

From the repository root, build both the backend server and frontend client:
```bash
npm run build
```

This compiles:
1. `server/dist/` — Compiled CommonJS backend server
2. `client/dist/` — Optimized production static bundle (HTML, CSS, JS, 3D WebGL assets)

---

## 2. Environment Variables Configuration

Create a `.env` file in `server/`:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=replace_with_a_secure_random_64_char_secret_key_in_production
CLIENT_URL=https://your-domain.org
```

Create a `.env` file in `client/` (if API is hosted on a separate subdomain):
```env
VITE_API_URL=https://api.your-domain.org/api
```

---

## 3. Database Persistence & Backup Guidance

* **Database File:** `server/data/db.json`
* **Backup Procedure:**
  Automate daily backups using cron / scheduled task:
  ```bash
  cp server/data/db.json server/data/backups/db-$(date +%F).json
  ```
* **PostgreSQL / Supabase Migration:**
  The schema defined in `server/src/db/index.ts` maps 1-to-1 with standard relational tables (`users`, `member_profiles`, `admission_enquiries`, `volunteer_enquiries`, `donation_enquiries`, `events`, `gallery_assets`, `services`, `faqs`, `audit_logs`).

---

## 4. Hosting Options

### Option A: Unified Node.js Server (Single Host: Render, Railway, Fly.io, or VPS)
Configure `server/src/index.ts` to serve the static frontend bundle from `client/dist`:
```javascript
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});
```

### Option B: Separate Frontend (Netlify / Vercel) + Backend (Railway / Render / VPS)
* Deploy `client/` to Netlify / Vercel with build command `npm run build` and publish directory `dist`.
* Deploy `server/` with `npm run start` and configure CORS to allow your domain.

---

## 5. Security Checklist Before Going Live

1. Log in to `/admin-login` with initial bootstrap credentials (`Ashvin` / `@Ashwin2834`).
2. Rotate the superadmin password immediately in the Account Security tab.
3. Configure HTTPS / SSL certificates.
4. Verify contact phone number (`+91 98908 98081`) and official email forwarders.
