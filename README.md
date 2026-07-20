# UCEConnect

> A web, Android, and Windows platform for reporting and tracking student incidents at Universidad Central del Ecuador.

## What is UCEConnect

UCEConnect replaces informal, untracked incident reporting at UCE with a structured system: students report academic, administrative, infrastructure, or wellbeing incidents; managers and administrators track, classify, and resolve them through a shared dashboard. Incidents are auto-classified by AI (priority and category suggestion), support file evidence, and include a real-time conversation thread between student and manager once a case is in progress.

## Team

| Role | Member | Responsibilities |
|---|---|---|
| Backend Developer / Software Architect / Product Owner | Adrian Lumbi | Backend architecture, API, database, AI integration |
| Frontend Developer / Scrum Master | Nayeli Guayas | React frontend, UI/UX, sprint coordination |
| DevOps Engineer / Business Analyst / QA | Luis Paspuezán | CI/CD, deployment, requirements, quality assurance |

Supervisor: Ing. Juan Pablo Guevara Gordillo
Institution: Universidad Central del Ecuador — Programación Web 2026

---

## Tech Stack

### Backend
- Node.js 18 · Express 4.19
- PostgreSQL via `pg` 8.12 (raw SQL, no ORM)
- Zod 3.23 (request validation)
- JSON Web Tokens (`jsonwebtoken` 9.0) · bcrypt 6.0
- Socket.IO 4.8 (real-time chat and notifications)
- Winston 3.19 (logging)
- Nodemailer 9.0 (transactional email)
- Cloudinary 2.4 (avatars, logos, incident attachments)
- OpenRouter (Gemini model) via the `openai` SDK 4.56 — AI incident classification and monthly report summaries
- `@azure/msal-node` 2.16 — Microsoft OAuth login
- Helmet 7.1 · cors 2.8 · multer 2.2
- exceljs 4.4 / pdfkit 0.19 — Excel and PDF report export
- Jest 29.7 + Supertest 7.0 (unit and integration tests)

### Frontend
- React 19.2 · TypeScript 6.0 · Vite 8.0
- TanStack React Query 5.101 (server state) · Zustand 5.0 (auth state, persisted)
- React Router DOM 7.17 · React Hook Form 7.78 + Zod 4.4 (validation)
- Axios 1.17 · Socket.IO client 4.8
- Tailwind CSS 3.4 · Recharts 3.9 (dashboards) · Lucide React (icons)
- Capacitor 7/8 (Android build) · Electron 41 + electron-builder (Windows installer)
- Vitest 4.1 + Testing Library (unit tests)

---

## Architecture

The backend follows **Domain-Driven Design** combined with **Hexagonal Architecture** (Ports and Adapters), organized in three layers:

- **`domain/`** — pure business logic and repository interfaces, zero external dependencies.
- **`application/`** — use cases that orchestrate the domain (e.g. `CreateIncident`, `LoginUser`, `SendObservation`).
- **`infrastructure/`** — adapters: Express routes/controllers, PostgreSQL repositories, Socket.IO, and external services (Cloudinary, Nodemailer, Gemini, Microsoft).

Four bounded contexts drive the domain model:

| Context | Covers |
|---|---|
| **Incidents** (core domain) | Incident lifecycle, categories, attachments, observations, internal notes |
| **Users** | Registration, authentication, profile, faculties/careers, admin user management |
| **Notifications** | Persisted notifications + real-time delivery over Socket.IO |
| **Analytics** | Dashboard metrics and AI-summarized monthly reports (PDF/Excel) |

A smaller **Settings** module (app metadata, FAQ, dynamic attachment policy) sits alongside these four as shared configuration, not a bounded context of its own.

The frontend is a **single shared React codebase** deployed to three targets: the web build (Nginx), an Android APK (Capacitor), and a Windows installer (Electron) — routing switches between `BrowserRouter` and `MemoryRouter` depending on the target.

---

## Repository Structure

```
UCEConnect/
├── .github/workflows/          # CI/CD pipelines (see CI/CD section)
├── backend/
│   ├── src/
│   │   ├── domain/             # incidents, users, notifications, reports, categories, settings
│   │   ├── application/        # use cases per context
│   │   └── infrastructure/
│   │       ├── db/             # PostgreSQL pool + SQL migrations
│   │       ├── repositories/   # Postgres*Repo (implements domain interfaces)
│   │       ├── services/       # Gemini, Cloudinary, Nodemailer, Microsoft, NotificationService
│   │       ├── sockets/        # chatHandler.js (Socket.IO)
│   │       └── http/           # routes, controllers, middlewares
│   ├── docker-compose.local.yml
│   └── Dockerfile.backend
├── frontend/
│   ├── src/
│   │   ├── pages/               # auth, student, manager, admin, public, dev
│   │   ├── hooks/, api/, store/, types/, schemas/
│   │   ├── components/ui/       # atoms, molecules, organisms, templates
│   │   └── router/              # AppRouter, ProtectedRoute
│   └── Dockerfile
├── docker-compose.yml           # generic local placeholder (see Getting Started)
├── docker-compose.qa.yml        # QA — pulls images from Docker Hub, external Supabase DB
├── docker-compose.prod.yml      # Production — same pattern as QA
└── README.md
```

---

## Environments

| Environment | Frontend | Backend | Database |
|---|---|---|---|
| Local | http://localhost:5173 (Vite dev server) | http://localhost:3000 | PostgreSQL in Docker (`backend/docker-compose.local.yml`) |
| QA | https://uceconnectqa.programacionwebuce.net | same domain, `/api/v1` | Supabase (external) |
| Production | https://uceconnectprod.programacionwebuce.net | same domain, `/api/v1` | Supabase (external) |

QA and Production run on separate AWS EC2 instances behind Cloudflare DNS/HTTPS, each with its own Supabase project and Cloudinary credentials.

---

## Getting Started

There is no `.env.example` in this repository — create `.env` files manually with the variables listed below.

### Backend

```bash
cd backend
# create backend/.env with the variables from the Environment Variables section

npm install
npm run docker:local   # starts PostgreSQL + the backend API via Docker (backend/docker-compose.local.yml)
```

The backend will be available at http://localhost:3000, with a health check at `/health`. Alternatively, run `npm run dev` (nodemon) against any reachable PostgreSQL instance, without Docker.

### Frontend

```bash
cd frontend
# create frontend/.env — at minimum:
# VITE_API_URL=http://localhost:3000

npm install
npm run dev
```

The frontend dev server runs at http://localhost:5173.

> Vite variables (`VITE_API_URL`, `VITE_SOCKET_URL`) are baked into the JS bundle at build time — changing them requires a rebuild, not just a container restart.

---

## API

**48 REST endpoints** across 9 route modules (`auth`, `incidents`, `notifications`, `dashboard`, `users`, `categories`, `reports`, `settings`, `faq`), plus 4 standalone endpoints (`/health`, `/api/v1/help`, `/api/v1/about`, `/api/v1/faculties`, `/api/v1/careers`) mounted directly in `server.js`, and a Socket.IO channel for real-time chat and notifications. See `backend/README.md` for the full endpoint list grouped by module. There is currently no Postman collection in the repository.

---

## CI/CD

GitHub Actions workflows found in `.github/workflows/`:

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | Push to `main`/`develop`, PRs to `main` | Placeholder pipeline (checkout + Node setup only) — not yet running real lint/tests/build |
| `deploy-qa.yml` | Push to `QA`, manual | Builds backend/frontend Docker images, pushes to Docker Hub (`qa`, `qa-YYYYMMDD-sha`), deploys to QA EC2 over SSH |
| `deploy-prod.yml` | Push to `main` | Same pipeline as QA, tagged `prod`/`prod-YYYYMMDD-sha`, deploys to Production EC2 |
| `manual-rollback-qa.yml` / `manual-rollback-prod.yml` | Manual (`workflow_dispatch`) | Re-pulls a given Docker image tag and redeploys it on the corresponding EC2 |
| `manual-cleanup-qa.yml` / `manual-cleanup-prod.yml` | Manual (`workflow_dispatch`) | Prunes unused Docker images/volumes/containers on the corresponding EC2 to free disk space |
| `build-android.yml` | Manual, QA/PROD selector | Builds the Capacitor Android debug APK and uploads it as a workflow artifact |
| `build-electron.yml` | Manual, QA/PROD selector, or push tag `v*` | Builds the Windows NSIS installer via electron-builder and uploads it as a workflow artifact |

Required Pull Request approval: at least one review from Luis Paspuezán (DevOps/QA), backend build/tests passing, frontend `npm run build` passing with no lint errors.

---

## Versioning

Current version: **v1.0.0-dev**

Convention: the middle number is incremented per sprint (`v1.0.X-dev`); `v1.0.0` (without suffix) is reserved for the final delivery.
