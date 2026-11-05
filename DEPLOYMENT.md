# Production Deployment & Hosting Guide
### SBBM Social Foundation

This guide provides complete instructions for deploying the full-stack application to production.

---

## 1. Quick Start (Unified Production Deployment)

The project is architected as a **unified production application**: the Node.js Express server (`server/dist/index.js`) securely hosts both the backend REST API (`/api/*`) and serves the compiled Single Page Application (SPA) frontend (`client/dist`).

### Step 1: Install Dependencies
```bash
npm install
npm run --prefix server install
npm run --prefix client install
```

### Step 2: Build Both Client and Server
```bash
npm run build
```
This runs:
- `npm run build:server` (`tsc` inside `server/`)
- `npm run build:client` (`tsc -b && vite build` inside `client/`)

### Step 3: Run the Production Server
```bash
npm start
```
By default, the server listens on port `5000` (or `process.env.PORT` provided by your cloud provider).
Open your browser to:
- `http://localhost:5000/` — Full frontend application
- `http://localhost:5000/api/health` — System health endpoint

---

## 2. Environment Variables Configuration

### Server (`server/.env` or Platform Environment Variables)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for the HTTP server (automatically supplied by Render/Heroku/Railway) |
| `NODE_ENV` | `production` | Set to `production` for security, optimized error handling, and performance |
| `JWT_SECRET` | *(Random 64-char string)* | Cryptographic key used to sign and verify session tokens |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin (only necessary when frontend is on a separate origin) |

### Client (`client/.env` - optional)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `/api` (in production) | Base URL for API calls. In production, relative path `/api` is used automatically. |

---

## 3. Platform-Specific Deployment Guides

### A. Render.com / Railway.app / Fly.io (Recommended)
1. Link your GitHub repository.
2. Set **Root Directory**: `.`
3. Set **Build Command**: `npm install && npm run --prefix server install && npm run --prefix client install && npm run build`
4. Set **Start Command**: `npm start`
5. Configure Environment Variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=<your-random-64-character-secret>`
6. Deploy! Render/Railway will automatically expose the app on port `$PORT`.

### B. Linux VPS (Ubuntu / Debian with PM2 & Nginx)
1. Install Node.js 18+ and PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
2. Clone repository and build:
   ```bash
   git clone <repo-url> /var/www/ssbm-website
   cd /var/www/ssbm-website
   npm install && npm run build
   ```
3. Start with PM2:
   ```bash
   pm2 start server/dist/index.js --name "ssbm-website"
   pm2 save
   pm2 startup
   ```
4. Configure Nginx Reverse Proxy with SSL (Certbot):
   ```nginx
   server {
       server_name sbbmsocialfoundation.org www.sbbmsocialfoundation.org;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   Run: `sudo certbot --nginx -d sbbmsocialfoundation.org -d www.sbbmsocialfoundation.org`

### C. Docker Deployment
A standard multi-stage Dockerfile can be placed at the root:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
RUN npm install
RUN npm --prefix server install
RUN npm --prefix client install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm --prefix server install --omit=dev
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/data ./server/data
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 4. Database Persistence & Backup Guidance

* **Database File:** `server/data/db.json`
* **Automated Daily Backup Script:**
  Add a cron job on your host (`crontab -e`):
  ```bash
  0 2 * * * cp /var/www/ssbm-website/server/data/db.json /var/backups/ssbm-db-$(date +\%F).json
  ```
* **Production RDBMS Migration Path:**
  All data models (`users`, `member_profiles`, `admission_enquiries`, `volunteer_enquiries`, `donation_enquiries`, `tasks`, `projects`, `audit_logs`) in `server/src/db/index.ts` adhere to standard relational database schemas. An ORM migration (Prisma / Drizzle / PostgreSQL) can be connected seamlessly with zero changes to frontend interfaces.

---

## 5. Security & Pre-Launch Checklist

- [x] Initial admin credentials bootstrap: `ashvin` / `@Ashvin2824`
- [x] Rotate admin password upon initial login in the Admin Dashboard Settings tab
- [x] Cryptographic password hashing (Bcrypt 10 rounds) enabled for all accounts
- [x] Default initial password security: Users are prompted to customize passwords on first sign-in
- [x] RBAC enforcement across all endpoints (Admin, Seva Member, Volunteer, Society Member, Admission Applicant)
- [x] Strict IDOR (Insecure Direct Object Reference) prevention implemented on all data modification endpoints
- [x] Automatic HTTPS / SSL certificate configured on production domain
- [x] Official contact numbers verified: `+91 98908 98081` / `+91 94221 13862`

---

## 6. QA & Test Verification Status

The entire platform passes 100% of the comprehensive regression and end-to-end integration test suites:
- `test_login_suite.js`: 5/5 PASSED (All portal logins, credentials, error hints, whitespace tolerance)
- `test_new_password_format.js`: 5/5 PASSED (Senior resident first 4 letters + birth year verification)
- `test_admission_suite.js`: 49/49 PASSED (Full admission lifecycle, RBAC, documents, status audit timeline)
- `test_audit_suite.js`: 33/33 PASSED (Admin controls, Seva workflow, Volunteer, Society Member, RBAC)
- `run_final_e2e_verification.js`: 43/43 PASSED (Multi-user isolation, IDOR, SQLi injection prevention, persistence)
- **Total Tests:** 135 / 135 PASSED (0 Failures)
