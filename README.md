# UCEConnect

[![Deploy QA](https://github.com/UCEConnect/UCEConnect/actions/workflows/deploy-qa.yml/badge.svg)](https://github.com/UCEConnect/UCEConnect/actions/workflows/deploy-qa.yml)
[![Deploy PROD](https://github.com/UCEConnect/UCEConnect/actions/workflows/deploy-prod.yml/badge.svg)](https://github.com/UCEConnect/UCEConnect/actions/workflows/deploy-prod.yml)
[![Release](https://img.shields.io/github/v/release/UCEConnect/UCEConnect)](https://github.com/UCEConnect/UCEConnect/releases)
[![License](https://img.shields.io/badge/license-Academic-blue.svg)](#)

**Student Incident Management Platform — Universidad Central del Ecuador (FEUE-UCE)**

UCEConnect centralizes the reporting, tracking, and resolution of incidents within the university campus (infrastructure, security, student services, among others). It replaces informal, untracked incident reporting with a structured system featuring AI-assisted classification, multimedia evidence, real-time status tracking, and dedicated dashboards for students, managers, and university authorities — available as web, Android, and Windows applications.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Backend | NestJS · TypeScript · TypeORM/Prisma |
| Web Frontend | React 18 · TypeScript · Vite |
| Desktop Frontend (Admin/Managers) | Electron · electron-builder (NSIS) · same React codebase |
| Mobile Frontend (Students) | Capacitor · same React codebase |
| Database | PostgreSQL (Supabase) |
| Media & Storage | Cloudinary |
| AI Classification | OpenRouter API |
| Infrastructure & Containers | Docker · Docker Compose · Nginx (reverse proxy) |
| CI/CD | GitHub Actions · Docker Hub |
| DNS & HTTPS | Cloudflare |
| Deployment | AWS EC2 (Ubuntu 24.04) |
| Project Management | Jira |

---

## System Architecture

UCEConnect follows a **single shared frontend codebase** deployed across three targets (web, Android, Windows), backed by a decoupled NestJS API:

```
                        ┌────────────────────────┐
                        │      Cloudflare          │
                        │   DNS + HTTPS/SSL        │
                        └───────────┬──────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   Nginx (reverse     │
                         │   proxy) — EC2       │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                                     │
          ┌───────▼────────┐                  ┌────────▼────────┐
          │  Frontend        │                  │  Backend         │
          │  React + Vite    │──── REST API ───▶│  NestJS          │
          │  (Docker)        │                  │  (Docker)        │
          └───────┬──────────┘                  └────────┬────────┘
                  │                                       │
     ┌────────────┼────────────┐             ┌────────────┼────────────┐
     │            │            │             │            │            │
┌────▼───┐  ┌─────▼─────┐ ┌────▼────┐  ┌─────▼─────┐ ┌────▼────┐ ┌─────▼─────┐
│Web      │  │Capacitor  │ │Electron │  │PostgreSQL │ │Cloudinary│ │OpenRouter │
│(browser)│  │(Android)  │ │(Windows)│  │(Supabase) │ │(media)   │ │(AI)       │
└─────────┘  └───────────┘ └─────────┘  └───────────┘ └──────────┘ └───────────┘
```

- Routing is conditional per platform: `BrowserRouter` for web/Capacitor, `MemoryRouter` for Electron (`file://` protocol).
- Separate Supabase projects for QA and PROD; separate Cloudinary API keys per environment.
- Backend and frontend are built and shipped as independent Docker images, versioned and pushed to Docker Hub.

---

## Screenshots

> _Reserved section for visual evidence of the three applications. Replace the links below with actual screenshots._

### 🌐 Web

<!-- ![Web - Login](docs/screenshots/web-login.png) -->
<!-- ![Web - Dashboard](docs/screenshots/web-dashboard.png) -->
<!-- ![Web - Create Incident](docs/screenshots/web-create-incident.png) -->

### 📱 Mobile (Android — Capacitor)

<!-- ![Mobile - Login](docs/screenshots/mobile-login.png) -->
<!-- ![Mobile - Incident List](docs/screenshots/mobile-incidents.png) -->

### 🖥️ Desktop (Windows — Electron)

<!-- ![Desktop - Installer](docs/screenshots/desktop-installer.png) -->
<!-- ![Desktop - Dashboard](docs/screenshots/desktop-dashboard.png) -->

---

## Repository Structure

```
UCEConnect/
├── .github/
│   └── workflows/
│       ├── deploy-qa.yml            # Build, push and automatic deploy to QA
│       ├── deploy-prod.yml          # Build, push and manual deploy to PROD
│       ├── manual-rollback-qa.yml   # Manual rollback by Docker tag (QA)
│       ├── manual-rollback-prod.yml # Manual rollback by Docker tag (PROD)
│       ├── manual-cleanup-qa.yml    # Old tag cleanup (QA)
│       ├── manual-cleanup-prod.yml  # Old tag cleanup (PROD)
│       ├── build-android.yml        # APK build (Capacitor, JDK 21, ubuntu-latest)
│       └── build-electron.yml       # Windows installer build (Electron, windows-latest)
│
├── backend/                          # NestJS API
├── frontend/                         # React + TS + Vite (base for web, Capacitor, Electron)
├── docker-compose.yml                # Local development
├── docker-compose.qa.yml             # QA environment
├── docker-compose.prod.yml           # Production environment
├── .env.example
├── .gitignore
└── README.md
```

---

## Environment Requirements

- Docker & Docker Compose
- Node.js 20+ (only for local development without Docker)
- Supabase account or a PostgreSQL instance
- Cloudinary account (API key/secret)
- OpenRouter API key

---

## Quick Start Guide

### Run the full environment with Docker

```bash
# 1. Clone the repository
git clone https://github.com/UCEConnect/UCEConnect.git
cd UCEConnect

# 2. Configure environment variables
cp .env.example .env
# fill in backend/.env and frontend/.env as needed

# 3. Bring up all containers
docker compose up -d --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

> ⚠️ Changing environment variables requires `docker compose up -d --force-recreate` — a `restart` does **not** reload `.env`. Vite variables (`VITE_API_URL`) are baked into the JS bundle at build time and cannot be changed at container runtime.

### Individual component development

See each subproject for standalone setup:
- `backend/README.md`
- `frontend/README.md`

At minimum, a reachable PostgreSQL instance (Supabase) is required for the backend.

---

## Environment Variables (.env)

### Backend

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend listening port | `3000` |
| `DATABASE_URL` | Supabase/PostgreSQL connection string | — |
| `JWT_SECRET` | Secret key for signing JWTs | — |
| `JWT_EXPIRATION` | JWT token duration | `15m` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `dxyqmmcvy` |
| `CLOUDINARY_API_KEY` | Cloudinary API key (per environment) | — |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (per environment) | — |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI classification | — |
| `MICROSOFT_CLIENT_ID` | Azure AD client ID for OAuth | — |
| `MICROSOFT_TENANT_ID` | Azure AD tenant ID | — |
| `SENTRY_DSN` | Sentry DSN for error tracking | — |

### Frontend

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `/api` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for uploads | `dxyqmmcvy` |
| `VITE_MICROSOFT_CLIENT_ID` | Azure client ID for the web app | — |

> `.env` files are listed in `.gitignore` and must never be committed.

---

## Branching and Deployment Flow

```
feature/UCE-XX-description ──► Develop (integration) ──► QA (testing) ──► main (production)
```

| Branch | Purpose | Deployment |
|---|---|---|
| `feature/UCE-XX-*` | Individual task development (Jira) | — |
| `Develop` | Continuous team integration | — |
| `QA` | Quality assurance / testing environment | AWS EC2 — automatic on merge |
| `main` | Stable production branch | AWS EC2 — manual, requires PO approval |

**Mandatory requirements to approve Pull Requests:**
- Backend: successful build and passing tests.
- Frontend: no lint errors and a successful `npm run build`.
- At least one approved review (Luis Paspuezán, DevOps/QA — sole merge approver).

---

## CI/CD Automation (Pipeline)

- **Push to `feature/*`:** triggers component-specific checks (build/lint) in isolation.
- **Merge to `Develop`:** integration checks across the team's work.
- **Merge to `QA`:** builds and publishes Docker images tagged `qa` and `qa-YYYYMMDD-sha`, deploys automatically to the QA EC2 instance (`deploy-qa.yml`).
- **Merge to `main`:** builds production images, publishes them to Docker Hub (`prod`, `prod-YYYYMMDD-sha`, and the semantic version tag), creates the corresponding Git tag and GitHub Release, and requires manual PO approval before deploying to the PROD EC2 instance (`deploy-prod.yml`).
- **Manual workflows:** `manual-rollback-qa/prod.yml` (rollback by Docker tag) and `manual-cleanup-qa/prod.yml` (old tag cleanup).
- **On-demand builds:** `build-android.yml` (Capacitor APK) and `build-electron.yml` (Windows NSIS installer), both manually dispatched with a QA/PROD environment selector.

---

## Versioning Policy

The project follows semantic versioning (`MAJOR.MINOR.PATCH`):

- **Patch** — small fixes/improvements (e.g. `1.0.0` → `1.0.1`)
- **Minor** — new complete features (e.g. `1.0.0` → `1.1.0`)
- **Major** — breaking changes or major deliveries (e.g. `1.0.0` → `2.0.0`)

---

## Environments

| Environment | URL | EC2 |
|---|---|---|
| QA | https://uceconnectqa.programacionwebuce.net | `44.196.226.27` |
| PROD | https://uceconnectprod.programacionwebuce.net | `34.193.228.94` |

---

## Project Authors

| Name | Role | GitHub |
|---|---|---|
| Luis "Lucho" Paspuezán | DevOpsSec / SRE / QA / Business Analyst | @_(pendiente)_ |
| Adrian Lumbi | Backend Engineer / Architect | [@Wadri02](https://github.com/Wadri02) |
| Nayeli Guayas | Frontend Engineer / Scrum Master | [@guayasnayeli](https://github.com/guayasnayeli) |
| Juan Pablo Guevara | Instructor / Product Owner | [@JuanGuevara90](https://github.com/JuanGuevara90) |

Universidad Central del Ecuador — Web Programming, in partnership with FEUE
