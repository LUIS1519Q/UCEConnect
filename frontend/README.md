# UCEConnect — Frontend

## Overview

UCEConnect's frontend is a single React SPA codebase shipped to three build targets:

- **Web** — built with Vite, served behind Nginx (`npm run build` → `frontend/dist`).
- **Android** — the same codebase wrapped with Capacitor and compiled into an APK (`npm run cap:build:android`).
- **Windows desktop** — the same codebase wrapped with Electron and packaged into an NSIS installer (`npm run electron:build`).

Routing switches automatically between `BrowserRouter` (web/Capacitor) and `MemoryRouter` (Electron, which serves from the `file://` protocol) based on a runtime check for the Electron user agent.

## Tech Stack

| Concern | Package | Version |
|---|---|---|
| Framework | react / react-dom | ^19.2.6 |
| Language | typescript | ~6.0.2 |
| Build tool | vite | ^8.0.12 |
| State management (server state) | @tanstack/react-query | ^5.101.0 |
| State management (auth/session) | zustand | ^5.0.14 |
| Styling | tailwindcss | ^3.4.17 |
| HTTP client | axios | ^1.17.0 |
| Router | react-router-dom | ^7.17.0 |
| Real-time | socket.io-client | ^4.8.3 |
| Form validation | react-hook-form ^7.78.0 + @hookform/resolvers ^5.4.0 + zod ^4.4.3 |
| Mobile (Capacitor) | @capacitor/core, @capacitor/android | ^8.4.1 |
| Mobile CLI | @capacitor/cli | ^7.6.7 |
| Desktop (Electron) | electron | ^41.7.1 |
| Desktop packaging | electron-builder | ^26.15.3 |
| Charts | recharts | ^3.9.2 |
| Icons | lucide-react | ^1.21.0 |
| Class merging | clsx ^2.1.1 + tailwind-merge ^3.6.0 |
| Testing | vitest ^4.1.9 + @testing-library/react ^16.3.2 |

## Project Structure

```
frontend/src/
├── pages/
│   ├── public/          # LandingPage
│   ├── auth/             # Login, Register, VerifyCode, ForgotPassword, ResetPassword, MicrosoftCallback
│   ├── student/          # MyIncidents, CreateIncident, IncidentDetail, EditIncident,
│   │                     # RespondToManagerRequest, Notifications, Profile, Help, About
│   ├── manager/           # Dashboard, Incidents, IncidentDetail, Feedback, Notifications, Profile
│   ├── admin/             # Dashboard, Incidents, IncidentsDetail, Users, Categories, Settings, Notifications, Profile
│   └── dev/               # AuthShowcase, StudentShowcase — internal component preview pages, not real screens
├── router/                # AppRouter.tsx (route table + NavigationRefSetter), ProtectedRoute.tsx
├── hooks/                 # 44 hooks, one file per feature (useLogin, useIncidents, useIncidentChat, useAdminUsers, ...)
├── api/                   # 10 axios service modules + client.ts (authService, incidentService, userService, ...)
├── store/                 # authStore.ts (Zustand)
├── types/                 # shared TypeScript types per domain (auth, user, incident, chat, notification, ...)
├── schemas/                # zod validation schemas, grouped by area (auth/, student/, manager/)
├── lib/                    # socket.ts (Socket.IO client singleton), navigationRef.ts (router-outside-React navigation)
├── constants/              # routes.ts, queryKeys.ts, apiEndpoints.ts, authText.ts, logoMap.ts
├── config/                 # react-query.ts
├── utils/                  # cn.ts, compressImage.ts, plataform.ts
├── mocks/                  # fallback fixture data used when the API call fails (dev/demo resilience)
├── test/                   # Vitest setup and test suites
└── components/ui/
    ├── atoms/               # Button, TextInput, Textarea, StatusBadge, Logo, Avatar, FileChip, Checkbox, Divider, Link, SocialButton, TimerText
    ├── molecules/           # FormField, FormRow, OTPInput, PasswordInput, IncidentCard, ChatBubble, NotificationItem, Pagination, SearchBar, Tabs, EvidenceItem, FAQItem, ProfileInfoItem, SimilarIncidentBanner
    ├── organisms/           # LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, VerifyCodeForm, AppHeader, AppSidebar, IncidentList, ConversationThread, Modal, Timeline, NotificationList, EvidenceSection, FAQSection, ProfileCard, SimilarIncidentModal, SimilarIncidentSection, LoadingState, EmptyState, ErrorState, MobileBottomNav, MobileMoreMenu
    └── templates/            # AppLayout, AuthSplitLayout, AuthCenteredLayout
```

## Screens by Role

### Student
| Page | Route | What it does |
|---|---|---|
| My Incidents | `/incidents` | Lists the student's own incidents with status tabs, search, and pagination |
| Create Incident | `/incidents/create` | Report form with a debounced live "similar incident" search while typing, and evidence upload |
| Incident Detail | `/incidents/:id` | Shows incident data, status history, evidence, and a cancel action (while `open`) |
| Edit Incident | `/incidents/:id/edit` | Edit title/description and add more evidence (only while status is `open`) |
| Respond to Manager Request | `/incidents/:id/conversation` | Real-time chat with the manager assigned to the incident |
| Notifications | `/notifications` | Search/filter notifications, mark as read, jump to the related incident |
| Profile | `/profile` | View/edit name, phone, faculty, career, and avatar |
| Help & FAQ | `/help` | Searchable FAQ list plus a support contact email |
| About | `/about` | App name, version, institution, and contact info |

### Manager
| Page | Route | What it does |
|---|---|---|
| Dashboard | `/manager/dashboard` | KPI cards + a Recharts bar chart of incidents by status + recent incidents |
| Incidents | `/manager/incidents` | Paginated/filterable/searchable table of all incidents |
| Incident Detail | `/manager/incidents/:id` | Status-change modal, category-correction modal, internal notes, evidence, AI summary |
| Feedback & Response | `/manager/incidents/:id/conversation` | Real-time chat with the student |
| Notifications | `/manager/notifications` | Same notification list as student, with manager-specific routing and "mark all as read" |
| Profile | `/manager/profile` | View/edit name, phone, and avatar |

### Admin
| Page | Route | What it does |
|---|---|---|
| Dashboard | `/admin/dashboard` | Same metrics as manager (horizontal bar breakdown instead of a chart) + quick links to Users/Categories |
| Incidents | `/admin/incidents` | Same table as manager's incidents page, routes to the admin (read-only) detail view |
| Incident Detail | `/admin/incidents/:id` | Read-only incident detail; internal notes shown as "view only — managed by manager" |
| Users | `/admin/users` | User management table; create/edit modal with role and active-status controls |
| Categories | `/admin/categories` | Category CRUD (name, description, active status) |
| Settings | `/admin/settings` | Tabbed page: "General" app settings + logo upload, and "Student content" FAQ CRUD |
| Notifications | `/admin/notifications` | Same list, routes non-incident notification types to Users/Categories/Settings |
| Profile | `/admin/profile` | View/edit name, phone, and avatar |

### Auth / Public
| Page | Route | What it does |
|---|---|---|
| Landing | `/` | Public marketing page with a static FAQ and links to login/register |
| Login | `/login` | Email + password login |
| Register | `/register` | Institutional-email registration (always creates a `student` account) |
| Verify Code | `/verify-code` | 6-digit code entry, shared by both the register flow and the forgot-password flow (`flow` state param picks which) |
| Forgot Password | `/forgot-password` | Requests a password-reset code by email |
| Reset Password | `/reset-password` | Sets a new password using the `resetToken` obtained after verifying the reset code |
| Microsoft OAuth Callback | `/auth/microsoft/callback` | Reads `accessToken`/`refreshToken` from the redirect query string, fetches the profile, and routes to the correct dashboard by role |

## State Management

`store/authStore.ts` is a Zustand store using the `persist` middleware, saved to `localStorage` under the key **`auth-storage`**.

- **Holds:** `user` (`{ id, firstName, lastName, email, role }`), `accessToken`, `refreshToken`.
- **Actions:** `setSession({ user, accessToken, refreshToken })`, `setTokens({ accessToken, refreshToken })`, `logout()` (clears all three fields).
- Read directly by `api/client.ts` (attaches the token, logs out on 401), `lib/socket.ts` (authenticates the socket), and `router/ProtectedRoute.tsx` (gates routes by role).

## API Integration

- **Base URL:** `api/client.ts` creates one axios instance with `baseURL: import.meta.env.VITE_API_URL`.
- **Auth header:** a request interceptor reads `accessToken` from `authStore` and sets `Authorization: Bearer <token>` on every outgoing request.
- **401 handling:** a response interceptor calls `authStore.logout()` and then `redirectToLogin()` (from `lib/navigationRef.ts`), which uses React Router's `navigate("/login", { replace: true })` if the router has already mounted (via a `NavigationRefSetter` component rendered inside `AppRouter`), falling back to `window.location.href` only if that hasn't happened yet.
- **Service files** (`src/api/`):
  - `client.ts` — the shared axios instance and interceptors described above.
  - `authService.ts` — `/api/v1/auth/*`: login, register, me, forgot/reset/verify/resend-password, Microsoft login redirect.
  - `incidentService.ts` — `/api/v1/incidents*`: list, create, similar-incident search/detail, attachments, detail, status update, edit, cancel, category correction, internal notes, observations.
  - `notificationService.ts` — `/api/v1/notifications`: list, mark as read.
  - `profileService.ts` — `/api/v1/auth/me`: get/update profile, update avatar.
  - `catalogService.ts` — `/api/v1/faculties`, `/api/v1/careers`.
  - `contentService.ts` — `/api/v1/help`, `/api/v1/about`.
  - `dashboardService.ts` — `/api/v1/dashboard`.
  - `userService.ts` — `/api/v1/users`: admin list/create/manage users.
  - `categoryService.ts` — `/api/v1/categories`: list/create/update categories.
  - `settingsService.ts` — `/api/v1/settings` (get/update/logo upload) and `/api/v1/faq` (FAQ CRUD).

## Real-time (Socket.io)

`lib/socket.ts` exports `getSocket()`, a lazy singleton `socket.io-client` instance:

- **Connection URL:** `import.meta.env.VITE_SOCKET_URL`, falling back to `http://localhost:3000` if unset.
- **Auth:** the current `accessToken` is passed as a `query` parameter (`query: { token: accessToken ?? "" }`); `autoConnect` is `false`, so the socket only connects when a consumer calls `.connect()`.
- **Managed exclusively by `hooks/useIncidentChat.ts`**, which connects/disconnects the socket per incident-chat page mount and is used by both `RespondToManagerRequestPage` (student) and `ManagerFeedbackPage` (manager).
- **Events emitted:** `join_incident` (`{ incidentId }`, sent on `connect`), `send_message` (`{ incidentId, message }`).
- **Events listened to:** `conversationLoaded`, `new_message`, `conversationLocked`, `error`, `connect`, `connect_error`.
- If the socket fails to connect, or doesn't respond within 2.5 seconds (`MOCK_FALLBACK_TIMEOUT_MS`), the hook falls back to a local, non-persisted mock conversation (`mocks/conversation.ts`) so the chat UI still renders.

## Role-based Routing

- `router/ProtectedRoute.tsx` reads `user` from `authStore`. If there's no user, it redirects to `/login`. If `allowedRoles` is passed and the user's role isn't in it, it also redirects to `/login`. It additionally blocks any non-`student` role when the app detects it's running as the native mobile build (`utils/plataform.ts` → `isMobileApp()`, via `Capacitor.isNativePlatform()`).
- **Post-login redirect by role** (`useLogin.ts` / `useMicrosoftCallback.ts`, both define the same map):
  - `student` → `/incidents`
  - `manager` → `/manager/incidents`
  - `admin` → `/admin/incidents`
- `router/AppRouter.tsx` wraps every role-specific route in `<ProtectedRoute allowedRoles={[...]}>` and also mounts a `NavigationRefSetter` helper component that registers the router's `navigate` function with `lib/navigationRef.ts`, so code outside of React components (like the axios 401 interceptor) can still trigger a client-side navigation.

## Running Locally

```bash
cd frontend
npm install
npm run dev
```

Dev server: **http://localhost:5173**. Requires `VITE_API_URL` pointing at a running backend.

## Building

### Web
```bash
npm run build
```
Output: `frontend/dist/`

### Android (Capacitor)
```bash
npm run cap:build:android
```
Runs `cap:sync` (build + `npx cap sync android`) then `cd android && gradlew.bat assembleDebug`. Requirements (from `.github/workflows/build-android.yml`): **Node 20**, **JDK 21** (Temurin distribution), Android SDK/Gradle toolchain available in `frontend/android`.

### Windows Desktop (Electron)
```bash
npm run electron:build
```
Runs `cross-env ELECTRON_BUILD=true VITE_API_URL=... npm run build && electron-builder`, producing an NSIS installer in `frontend/electron-dist`. Requirements (from `.github/workflows/build-electron.yml`): **Windows runner**, **Node 20**; `electron-builder`'s NSIS target is bundled as a devDependency, no separate install needed.

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend REST API base URL, baked into the bundle at build time | `http://localhost:3000` (currently set in `frontend/.env`) |
| `VITE_SOCKET_URL` | Socket.IO server URL, read in `lib/socket.ts` | Not currently set in `frontend/.env` — falls back to `http://localhost:3000` at runtime |

Vite variables are baked into the JS bundle at build time — changing them requires a rebuild, not just a restart.

## Testing

Vitest is configured (`vite.config.ts` → `test.environment: "jsdom"`, `test.setupFiles: "./src/test/setup.ts"`). Test suites already exist under `src/test/` covering atoms, molecules, organisms, templates, hooks, pages, the router, schemas, config, and constants.

```bash
npm test           # vitest (watch mode)
npm run test:ui    # vitest with the browser UI
npm run test:coverage   # vitest run --coverage
```

## Known Issues

Found while reading through every file for this document:

- **`ManagerIncidentDetailPage.tsx`** hardcodes a `CATEGORY_OPTIONS` list (`Academic` / `Financial` / `Systems` / `Other`, ids 1–4) for the "Correct category" modal instead of fetching the real categories from `GET /api/v1/categories`. The backend's actual seeded categories are named differently (`Académico`, `Administrativo`, `Infraestructura`, `Bienestar`), so a manager correcting a category sees names that don't match what's really stored, and may submit a `categoryId` that doesn't correspond to the category they think they picked.
- **`AdminSettingsPage.tsx`**'s "General" settings form (`maxFileSize`, `allowedFileTypes`) doesn't match the backend's real `PATCH /api/v1/settings` schema, which expects granular per-type fields (`maxFilesPerUpload`, `maxImageSizeBytes`, `maxDocumentSizeBytes`, `maxVideoSizeBytes`, `allowedImageTypes`, `allowedDocumentTypes`, `allowedVideoTypes`). This mismatch exists consistently across `types/settings.ts`, `settingsService.ts`, and the page itself, so it's internally consistent on the frontend side — but since the backend's Zod schema doesn't recognize `maxFileSize`/`allowedFileTypes` at all, those two fields are silently dropped on save while `applicationName`/`contactEmail` (which do match) save correctly.
- **`AdminSettingsPage.tsx`** also calls `setHasSyncedSettings(true)` and `setSettingsForm(...)` directly in the component body (not inside a `useEffect`) to sync the form once `settings` loads. This is a valid React pattern (updating a component's own state during its own render, guarded by a flag so it only runs once) but is unusual enough to flag — a `useEffect` would be the more conventional way to do this.
- **`components/ui/molecules/SimilarIncidentBanner`** exists as a full component but isn't imported anywhere in `pages/` — `CreateIncidentPage.tsx` uses the separate `SimilarIncidentSection` organism instead. Likely leftover/superseded code.
- No `.env.example` exists in `frontend/` — `VITE_API_URL` and `VITE_SOCKET_URL` must be set by hand in `frontend/.env`.
