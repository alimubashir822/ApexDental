# CareFlow AI — Healthcare Practice Operating System

CareFlow AI is a premium, production-ready AI-powered healthcare growth and operations platform designed to help clinics attract, convert, retain, and manage patients. It moves beyond a simple CRM, resolving clinic bottlenecks like client acquisition, scheduling no-shows, follow-up latencies, and multi-location franchise management.

---

## 🚀 Core Features

### 1. AI Front Desk Receptionist (Floating Chatbot)
- 24/7 patient qualification.
- Automatically handles treatment scoping (implants, veneers, teeth whitening, aligners).
- Registers leads into the CRM database pipeline and celebrates with visual confetti prompts.

### 2. AI Voice Phone Agent (`/dashboard/voice-agent`)
- Interactive phone call transcription simulator mimicking patient phone check-ins.
- Audio waveform visualizer and voice engine profile picker.
- Live qualification metrics and CRM database integration logs.

### 3. Clinic Location Franchise Selector
- Dropdown location switcher (Boston HQ, Brookline, Cambridge) mounted in the sidebar layout.
- Simulated location-synced loading overlay overlays for Group Clinic administrators.

### 4. Interactive Website Personalization (`/`)
- Dynamic header bar simulating inbound traffic parameters (e.g. searching for Invisalign vs. Implants).
- Home page hero headers, sub-text copy, pricing lists, reviews, and the lead intake select default auto-focus values update dynamically based on the toggled search intent.

### 5. AI Growth Consultant & HIPAA Audit Trail (`/dashboard/ai-assistant`)
- Real-time interactive consultant chat room querying active SQLite tables.
- HIPAA Security logs tracing operator actions (e.g. `LEAD_CAPTURED_AI`, `LEAD_STATUS_UPDATED`).
- Outbound patient communication thread monitors.

### 6. Practice Analytics & ROI (`/dashboard/analytics`)
- Circular SVG progress meter visualizing the **Patient Experience Score (PES)**.
- Latency comparison metrics (1.8s chatbot reply vs. 14.5m manual callback).
- Dynamic tabs rendering leads distribution, payments by billing channels, and marketing ROI.

### 7. White-Label Settings & Licensing (`/dashboard/settings`)
- Custom branding configurations (logo file upload, palette color switcher).
- Custom CNAME domain connection guide with interactive DNS verification logs.
- Franchise license controls to activate/deactivate Voice AI features.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: SQLite via Prisma 7 (LibSQL driver adapter)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Icons**: Lucide Icons
- **Visuals**: Recharts (Analytics charts), Canvas Confetti (Action celebrations)

---

## 🏁 Getting Started & Setup

Follow these commands to deploy the project locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup Database (Prisma 7 & SQLite)**:
   Ensure database schema is pushed and seeded:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
4. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Platform Sandbox Roles & Credentials
Switch between roles using the **Platform Role Sandbox** switcher in the sidebar dashboard layout:

- **Owner (Sarah Mitchell)**: `owner@medstack.com` — Full administrator rights (Analytics, Campaigns, Settings).
- **Doctor (Alexander Patel)**: `doctor@medstack.com` — Clinical access (Patients registry, Schedule calendar).
- **Manager (Elena Rostova)**: `manager@medstack.com` — Operational access.
- **Receptionist (Mark Harrison)**: `receptionist@medstack.com` — Check-in access.
- **Marketing Staff (Chloe Chen)**: `marketing@medstack.com` — Outreach builder access.

*Default Sandbox Password for all accounts:* **`admin123`**

---

## ⚖️ Compliance & Footer Links
- This platform utilizes audited **HIPAA Security Audit Logs** and tokenized cookie sessions (`medstack_session`).
- Public navigation footer includes attribution hyperlinks: **[Healthcare system by Med Clinic X](https://www.medclinicx.com/)**.
