# SBBM SOCIAL FOUNDATION & VYENKATESH ASHRAM
### Immersive 3D Full-Stack Application | Member Portal | Admin Dashboard | Multilingual AI Assistant

Official web application for **SBBM Social Foundation Society** (Reg No: **332-15-Nag**, Est. 2015), operating **VYENKATESH ASHRAM** — a charitable, non-granted old-age home at Anjikar Bagh, Mahuli, Parseoni (Nagpur District, Maharashtra).

---

## 🏛️ Verified Organization Profile

* **Society Name:** SBBM Social Foundation Society
* **Registration / Reference:** 332-15-Nag (Registered under Societies Registration Act, 2015)
* **Management & Leadership:** Mr. Ashwin Vyenkatrao Anjikar (Founder & President) & Mrs. Tina Anjikar
* **Official Ashram Helpline:** `+91 98908 98081`
* **Institution Facility (Old Age Home):**
  * *434, Anjikar Bagh, Mansar Mahuli Road, Village/Post Mahuli, Tehsil Parseoni, District Nagpur, Maharashtra – 441105*
* **Foundation Head Office:**
  * *C/o Ashvin V. Anjikar (Anjikar House), Panchpaoli, Timki Chimabai Peth, Nagpur, Maharashtra – 440018*

---

## 🌟 Key Architectural & Functional Deliverables

### 1. 3D Cinematic Entrance Sequence (`CinematicIntro3D.tsx`)
* **Scene 1 — Atmospheric Reveal:** Soft dawn morning mist, peaceful lighting, floating clouds, and the SSBM Foundation Gold Crest medallion.
* **Scene 2 — Grand Double Gate:** Wrought iron entrance gates anchored by stone pillars with carved ashram plaques, swinging realistically outward.
* **Scene 3 — Pathway Glide:** Camera travels along the stone-paved driveway flanked by orchard trees (mango & neem groves) and flowering marigold beds.
* **Scene 4 — Ashram Architectural Reveal:** Reconstructed two-story Vyenkatesh Ashram building featuring terracotta pitched roof, shaded veranda with stone pillars, second-floor balconies, windows, and authentic entrance facade.
* **Scene 5 — Seamless Transition:** Glides smoothly into the homepage. Includes immediate **Skip Intro** control, session persistence, and graceful fallback.

### 2. Vyenky — 3D Multilingual Assistant (`VyenkyChatbot.tsx`)
* **3D Animated Avatar:** Mini interactive 3D head rendered via Three.js with natural blinking, subtle breathing, head movements, cream kurta, and sage green scarf.
* **Trilingual Grounded Engine:** Switch between **English**, **हिंदी (Hindi)**, and **मराठी (Marathi)** with persistent state.
* **Knowledge Base:** Grounded in verified foundation facts, admission process, address verification, Go-Seva, naturopathy routines, and donation guidance.
* **Action Routing:** Direct buttons for "Open Admission Form", "View Contact", "Support Seva".
* **Escalation Helpline:** One-touch direct dial to `+91 98908 98081`.

### 3. Public Web Pages & Navigation
* **Home (`/`):** Hero with 3D walkthrough trigger, verified facility highlights, service cards, daily routine, gallery preview, and FAQ accordions.
* **About Us (`/about`):** Who We Are, Founder's Message from Mr. Ashwin V. Anjikar, Governance & Committees, Vision & Mission, History Timeline (2015–Present), and Registration Documents.
* **Services Directory (`/services`):**
  1. *Vyenkatesh Ashram (Old Age Home)*
  2. *Go-Seva Kendra (Cow Sanctuary & Care)*
  3. *Naturopathy & Holistic Wellness Garden*
  4. *Rural Education & Student Welfare*
  5. *Daily Activities & Cultural Rejuvenation*
  6. *Basic Healthcare & Routine Monitoring*
* **Old Age Home Page (`/old-age-home`):** Facility deep-dive, room layouts, daily routine timetable (06:00 AM to 09:00 PM), and admission guidelines.
* **Admission Enquiry (`/admission`):** Multi-step form capturing guardian contact, senior details, mobility status, medical history, with database persistence and reference ID.
* **Events (`/events`):** Upcoming and completed health camps and festival celebrations.
* **Gallery (`/gallery`):** Category filters (Architecture, Go-Seva, Naturopathy, Events) and high-res lightbox modal.
* **Membership (`/membership`):** Distinction between website accounts and official society membership.
* **Volunteer Seva (`/volunteer`):** Application for companionship, Gaushala care, and cultural seva.
* **Support / Donate (`/support`):** In-kind provisions checklist (groceries, cow fodder, medicines) and official receipt transparency.
* **Contact Us (`/contact`):** Dual-location cards (Head Office vs Ashram Facility), click-to-call, interactive contact form, and Google Maps links.

### 4. Member Portal (`/member/dashboard`)
* View assigned unique Member ID (`SSBM-2026-XXXX`).
* Profile management (address, emergency contact phone, blood group).
* Live tracking of submitted admission inquiries, volunteer forms, and donation pledges.
* Password change and account security.

### 5. Secure Administrator Portal (`/admin/dashboard`)
* **Initial Bootstrap Credentials:**
  * Username: `ashvin`
  * Initial Password: `@Ashvin2824` (stored as bcrypt hash; forced password rotation enforced).
* **Live Database Metrics:** Total users, pending admissions, pending memberships, volunteers, donation pledges, and unread messages.
* **Tabbed Modules:**
  * *Admissions Manager:* Update status (`new`, `reviewing`, `contacted`, `verified`, `closed`) and internal notes.
  * *Membership Requests:* Review and approve/reject applications.
  * *Volunteers & Donations:* Manage seva and receipt issuance.
  * *Events & Gallery CRUD:* Create, edit, and delete events and media.
  * *Audit Logs:* Immutable audit trails tracking administrative actions, user logins, and system events.

---

## 🛠️ Technology Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Three.js, React Three Fiber, React Three Drei, Framer Motion, Lucide React, Canvas Confetti.
* **Backend:** Node.js, Express, TypeScript, tsx, JWT (JSON Web Tokens), bcryptjs, CORS, dotenv.
* **Database & Persistence:** Atomic disk-backed JSON database store with WAL-style tmp-write safety (`server/data/db.json`), fully persistent and exportable.

---

## 🚀 Quick Start & Running Locally

### 1. Start Both Backend and Frontend Simultaneously
From the project root:
```bash
npm run dev
```

Or run each service individually:
* **Backend API (Port 5000):**
  ```bash
  npm run dev:server
  ```
* **Frontend Client (Port 5173):**
  ```bash
  npm run dev:client
  ```

### 2. Access the Application
* **Public Website & 3D Walkthrough:** [http://localhost:5173/](http://localhost:5173/)
* **Admin Login Portal:** [http://localhost:5173/admin-login](http://localhost:5173/admin-login)
* **Backend Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔒 Security Best Practices Implemented
* Passwords hashed using `bcryptjs` with salt factor 10. Plaintext credentials are never stored.
* Initial bootstrap admin account requires immediate password change upon first login.
* JWT bearer token authorization protecting all `/api/admin/*` and `/api/member/*` endpoints.
* In-memory IP rate limiting to prevent brute force attacks on authentication and enquiry endpoints.
* Transparent disclaimers stating that admission availability must be confirmed directly with management (+91 98908 98081).
