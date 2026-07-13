# UCEConnect — Backend

## Overview

REST API for UCEConnect, the student incident management platform of Universidad Central del Ecuador. Built with **Node.js + Express**, PostgreSQL (raw `pg`, no ORM), JWT authentication, and a Socket.IO channel for real-time chat and notifications. Runs on port `3000` (`PORT` env var), with a health check at `GET /health`.

## Architecture

Domain-Driven Design combined with Hexagonal Architecture (Ports and Adapters), in three layers with a strict dependency rule: **domain ← application ← infrastructure**. The domain never imports Express, `pg`, or any external library.

- **`domain/`** — entities, value objects, and repository interfaces (`Incident`, `IncidentStatus`, `IIncidentRepo`, `User`, `IUserRepo`, `Notification`, `INotificationRepo`, `Settings`, `HelpItem`, `Category`).
- **`application/`** — use cases orchestrating the domain (`CreateIncident`, `ClassifyIncident`, `DetectDuplicates`, `UpdateStatus`, `SendObservation`, `LoginUser`, `RegisterUser`, `GetDashboardMetrics`, `GenerateMonthlyReport`, etc.).
- **`infrastructure/`** — Express routes/controllers/middlewares, PostgreSQL repositories, the Socket.IO chat handler, and adapters for Cloudinary, Nodemailer, Gemini (via OpenRouter), and Microsoft OAuth.

Four bounded contexts:

| Context | Domain folder | Covers |
|---|---|---|
| **Incidents** (core) | `domain/incidents`, `domain/categories` | Incident lifecycle, status transitions, categories, attachments, observations, internal notes |
| **Users** | `domain/users` | Registration, login (local + Microsoft SSO), profile, faculties/careers, admin user management |
| **Notifications** | `domain/notifications` | Persisted notifications + real-time push over Socket.IO |
| **Analytics** | `domain/reports` | Dashboard metrics, AI-summarized monthly reports (PDF/Excel) |

`domain/settings` (app metadata, FAQ, dynamic attachment policy) is shared configuration, not a bounded context of its own.

## Tech Stack

| Package | Version |
|---|---|
| express | ^4.19.2 |
| pg | ^8.12.0 |
| zod | ^3.23.8 |
| jsonwebtoken | ^9.0.2 |
| bcrypt | ^6.0.0 |
| socket.io | ^4.8.3 |
| winston | ^3.19.0 |
| nodemailer | ^9.0.1 |
| cloudinary | ^2.4.0 |
| openai (OpenRouter client, Gemini model) | ^4.56.0 |
| @azure/msal-node | ^2.16.2 |
| helmet | ^7.1.0 |
| cors | ^2.8.5 |
| multer | ^2.2.0 |
| exceljs | ^4.4.0 |
| pdfkit | ^0.19.1 |
| jest / supertest (dev) | ^29.7.0 / ^7.0.0 |

## Project Structure

```
backend/src/
├── domain/
│   ├── incidents/        # Incident, IncidentStatus, Attachment, Observation, InternalNote + interfaces
│   ├── categories/        # Category, ICategoryRepo
│   ├── users/              # User, IUserRepo, IEmailNotifier
│   ├── notifications/     # Notification, INotificationRepo
│   ├── reports/            # IReportSummarizer
│   └── settings/           # Settings, HelpItem + interfaces
├── application/
│   ├── incidents/          # CreateIncident, ClassifyIncident, DetectDuplicates, FindSimilarIncidents,
│   │                       # ListIncidents, GetIncidentById, UpdateIncident, UpdateStatus, CancelIncident,
│   │                       # CorrectCategory, UploadAttachments, GetObservations, SendObservation, AddInternalNote
│   ├── categories/         # CreateCategory, ListCategories, UpdateCategory
│   ├── users/               # RegisterUser, LoginUser, LoginWithMicrosoft, VerifyCode, ForgotPassword,
│   │                       # ResetPassword, UpdateProfile, UpdateAvatar, ListUsers, ManageUser, CreateUserByAdmin...
│   ├── notifications/      # GetNotifications, MarkNotificationRead
│   ├── reports/            # GenerateMonthlyReport
│   └── settings/           # GetSettings, UpdateSettings, UploadLogo, Create/Update/DeleteFaqItem
└── infrastructure/
    ├── db/                  # connection.js (pg Pool) + migrations/ (8 SQL files)
    ├── repositories/       # Postgres*Repo — one per domain interface
    ├── services/            # GeminiClassifier, GeminiReportSummarizer, CloudinaryService,
    │                        # MicrosoftAuthService, NotificationService
    ├── sockets/             # chatHandler.js
    ├── logger/              # Winston logger
    └── http/
        ├── controllers/
        ├── middlewares/    # authMiddleware, roleMiddleware, uploadMiddleware
        └── routes/          # 9 route modules
```

## Database

PostgreSQL, plain SQL migrations (no ORM/query builder) — 15 tables across 8 migration files.

### Tables

| Table | Description |
|---|---|
| `roles` | The 3 system roles: student, manager, admin |
| `users` | Accounts, credentials, profile, faculty/career, avatar |
| `verify_codes` | 6-digit email codes for account verification |
| `password_reset_codes` | 6-digit codes for password recovery |
| `categories` | Incident categories (Académico, Administrativo, Infraestructura, Bienestar) |
| `incidents` | Core incident record — status, priority, ticket, AI summary |
| `incident_history` | Status change audit trail per incident |
| `attachments` | Uploaded evidence files (Cloudinary URL, mime type, size) |
| `observations` | Public conversation thread between student and staff |
| `internal_notes` | Private staff-only notes per incident |
| `notifications` | Persisted per-user notifications |
| `faculties` | UCE faculty catalog (21 seeded rows) |
| `careers` | Career catalog per faculty (~62 seeded rows) |
| `help_items` | FAQ entries |
| `about_info` | Singleton row: app metadata + dynamic attachment-policy limits |

### Migrations

| File | What it does |
|---|---|
| `001_initial_schema.sql` | Creates `roles`, `users`, `verify_codes`, `categories`, `incidents`, `incident_history`, `attachments`, `observations`, `notifications`; seeds roles and categories |
| `002_password_reset_codes.sql` | Adds `password_reset_codes` |
| `003_user_first_last_name.sql` | Adds `first_name`/`last_name` to `users`, backfilled from `name` |
| `004_student_module.sql` | Adds `ticket`/`status_reason` to `incidents`, `faculty_id`/`career_id`/`avatar_url` to `users`; creates and seeds `faculties`, `careers`, `help_items`, `about_info` |
| `005_user_phone.sql` | Adds `phone` to `users` |
| `006_incident_attachments.sql` | Adds `original_filename`/`mime_type`/`size_bytes`/`uploaded_by` to `attachments` |
| `007_internal_notes.sql` | Creates `internal_notes` |
| `008_settings.sql` | Adds logo and attachment-policy limit columns to `about_info` |

### Environments

| Environment | Database |
|---|---|
| Local | PostgreSQL in Docker (`backend/docker-compose.local.yml`, port 5433) |
| QA | Supabase (external, separate project from Production) |
| Production | Supabase (external) |

## Endpoints

### Health
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/health` | Public | Service health check |

### Auth — `/api/v1/auth`
| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a student account (`@uce.edu.ec` only), sends a 6-digit verification code by email |
| POST | `/verify-code` | Public | Verify the 6-digit code, activates the account |
| POST | `/login` | Public | Log in — returns `accessToken` (1h) + `refreshToken` (7d) |
| POST | `/resend-code` | Public | Resend a new verification code |
| POST | `/forgot-password` | Public | Request a password reset code by email |
| POST | `/verify-reset-code` | Public | Verify the reset code — returns a short-lived `resetToken` (15m) |
| POST | `/resend-reset-code` | Public | Resend a new password reset code |
| POST | `/reset-password` | Public | Set a new password using the `resetToken` |
| GET | `/microsoft` | Public | Redirect to Microsoft OAuth (Azure AD) |
| GET | `/microsoft/callback` | Public | OAuth callback — issues JWTs, redirects to frontend |
| GET | `/me` | Authenticated | Get the current user's profile |
| PATCH | `/me` | Authenticated | Update profile (name, phone, faculty, career) |
| PATCH | `/me/avatar` | Authenticated | Upload/replace avatar (Cloudinary, face-cropped 400×400) |

### Incidents — `/api/v1/incidents`
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/` | Any | List incidents — student sees only their own; manager/admin get paginated results filterable by status/category |
| POST | `/` | student | Create an incident — triggers AI classification and duplicate detection |
| GET | `/:id` | Any (owner-checked) | Incident detail + status history + attachment/observation counts + internal notes (non-student) |
| GET | `/:id/observations` | Any (owner-checked) | Full observation/comment thread |
| GET | `/:id/similar` | Any (owner-checked) | Public detail of a similar incident |
| POST | `/similar` | student | Live similar-incident search while composing a new report |
| PATCH | `/:id` | student (owner, `open` only) | Edit title/description/category |
| PATCH | `/:id/cancel` | student (owner, `open` only) | Cancel an incident |
| PATCH | `/:id/status` | manager, admin | Change status — validated by the `IncidentStatus` state machine |
| POST | `/:id/attachments` | student, manager, admin | Upload evidence files (validated against the attachment policy) |
| PATCH | `/:id/category` | manager, admin | Correct the AI-assigned category (blocked once closed) |
| POST | `/:id/internal-notes` | manager, admin | Add a private note, never shown to the student |

### Notifications — `/api/v1/notifications`
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/` | Authenticated | List notifications, paginated, filterable by unread |
| PATCH | `/:id/read` | Authenticated | Mark a notification as read |

### Dashboard — `/api/v1/dashboard`
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/` | manager, admin | Status counts, daily trend, and 10 most recent incidents |

### Reports — `/api/v1/reports`
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/monthly` | admin | AI-summarized monthly report (JSON) |
| GET | `/monthly/pdf` | admin | Same report, PDF download |
| GET | `/monthly/excel` | admin | Same report, Excel download |

### Admin Users — `/api/v1/users`
| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/` | admin | Create a user — verified immediately, random throwaway password, sends welcome + reset-code email |
| GET | `/` | admin | List users — filter by role/active, paginated, searchable |
| PATCH | `/:id/manage` | admin | Change a user's role and/or active status |

### Categories — `/api/v1/categories`
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/` | Any | List categories (filter by `isActive`) |
| POST | `/` | admin | Create a category |
| PATCH | `/:id` | admin | Update a category |

### Settings & FAQ
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/api/v1/settings` | Authenticated | Get app settings (name, contact info, attachment policy limits) |
| PATCH | `/api/v1/settings` | admin | Update app settings |
| POST | `/api/v1/settings/logo` | admin | Upload the app logo |
| POST | `/api/v1/faq` | admin | Create an FAQ item |
| PATCH | `/api/v1/faq/:id` | admin | Update an FAQ item |
| DELETE | `/api/v1/faq/:id` | admin | Delete an FAQ item |

### Catalogs
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/api/v1/help` | Authenticated | FAQ items + contact email |
| GET | `/api/v1/about` | Authenticated | App metadata (name, version, institution, contact) |
| GET | `/api/v1/faculties` | Authenticated | List all faculties |
| GET | `/api/v1/careers` | Authenticated | List careers by faculty |

**Total: 48 REST endpoints.**

### Socket.IO events

Authenticated via JWT passed as `handshake.auth.token`, an `Authorization` header, or `query.token`.

| Direction | Event | Payload | Description |
|---|---|---|---|
| Client → Server | `join_incident` | `{ incidentId }` | Joins the incident's room, requests conversation state |
| Client → Server | `send_message` | `{ incidentId, message }` | Posts an observation to the conversation |
| Server → Client | `joined` | `{ incidentId }` | Ack for `join_incident` |
| Server → Client | `conversationLoaded` | `{ conversationEnabled, messages, locked?, status?, lockMessage? }` | Full history + current conversation state |
| Server → Client | `new_message` | Observation | Broadcast to the incident's room on every new message |
| Server → Client | `error` | `{ message }` | Permission or validation error |
| Server → Client | `notification` | Notification | Pushed to the user's personal room (`user_{id}`) on every new notification |

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend listening port | `3000` |
| `NODE_ENV` | Environment name | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5433/uceconnect` |
| `JWT_SECRET` | Secret for signing access tokens | — |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | — |
| `JWT_EXPIRES_IN` | Access token lifetime | `1h` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime | `7d` |
| `EMAIL_USER` | Gmail SMTP account (Nodemailer) | `notifications@example.com` |
| `EMAIL_PASS` | Gmail app password | — |
| `OPENROUTER_API_KEY` | OpenRouter API key (AI classification/reports) | — |
| `OPENROUTER_MODEL` | OpenRouter model id | `google/gemini-2.5-flash-lite` |
| `CLOUDINARY_URL` | Cloudinary connection string | `cloudinary://key:secret@cloud_name` |
| `FRONTEND_URL` | Frontend origin (used by CORS) | `http://localhost:5173` |
| `ALLOWED_ORIGINS` | Comma-separated CORS allow-list | `http://localhost:5173` |
| `MICROSOFT_CLIENT_ID` | Azure AD app client ID | — |
| `MICROSOFT_TENANT_ID` | Azure AD tenant ID | — |
| `MICROSOFT_CLIENT_SECRET` | Azure AD app client secret | — |
| `MICROSOFT_REDIRECT_URI` | OAuth callback URL | `http://localhost:3000/api/v1/auth/microsoft/callback` |

`.env` is git-ignored and must never be committed. There is no `.env.example` currently in the repository.

## Running Locally

```bash
cd backend
npm install
npm run docker:local        # PostgreSQL + backend via backend/docker-compose.local.yml
npm run docker:local:logs   # tail container logs
npm run docker:local:down   # stop containers
```

Or without Docker, against any reachable PostgreSQL instance:

```bash
npm run dev   # nodemon, reads backend/.env
```

## Testing

```bash
npm test                # Jest — domain + application unit tests
npm run test:coverage   # unit tests with coverage report
npm run test:integration  # Jest --runInBand — integration tests (tests/integration)
```

There is no Postman collection in the repository (a previous one was removed as stale).

## Security

- **Authentication:** JWT access tokens (default 1h) + refresh tokens (default 7d), verified by `authMiddleware` on every protected route.
- **Authorization:** `roleMiddleware(...roles)` restricts routes to `student`/`manager`/`admin` combinations; the role travels signed inside the JWT.
- **Passwords:** hashed with bcrypt, 10 salt rounds.
- **Input validation:** every route validates `body`/`query` with Zod schemas before reaching the controller.
- **CORS:** origin allow-list from `ALLOWED_ORIGINS`, credentials enabled.
- **HTTP headers:** `helmet()` applied globally.
- **File uploads:** `multer` with per-type mime/size limits enforced by the (DB-configurable) attachment policy.
