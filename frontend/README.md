# UCEConnect — Frontend

## Overview

A single React SPA codebase shipped to three targets: the web build (served behind Nginx), an Android APK via Capacitor, and a Windows installer via Electron. Routing switches between `BrowserRouter` (web/Capacitor) and `MemoryRouter` (Electron's `file://` protocol) based on runtime detection.

## Tech Stack

| Package | Version |
|---|---|
| react / react-dom | ^19.2.6 |
| typescript | ~6.0.2 |
| vite | ^8.0.12 |
| @tanstack/react-query | ^5.101.0 |
| zustand | ^5.0.14 |
| react-router-dom | ^7.17.0 |
| react-hook-form | ^7.78.0 |
| zod | ^4.4.3 |
| axios | ^1.17.0 |
| socket.io-client | ^4.8.3 |
| tailwindcss | ^3.4.17 |
| recharts | ^3.9.2 |
| lucide-react | ^1.21.0 |
| @capacitor/core, @capacitor/android | ^8.4.1 |
| @capacitor/cli | ^7.6.7 |
| electron | ^41.7.1 |
| electron-builder | ^26.15.3 |
| vitest / testing-library (dev) | ^4.1.9 / ^16.3.2 |

## Project Structure

```
frontend/src/
├── pages/
│   ├── public/         # LandingPage
│   ├── auth/            # Login, Register, VerifyCode, ForgotPassword, ResetPassword, MicrosoftCallback
│   ├── student/         # MyIncidents, CreateIncident, IncidentDetail, EditIncident,
│   │                    # RespondToManagerRequest, Notifications, Profile, Help, About
│   ├── manager/          # Dashboard, Incidents, IncidentDetail, Feedback, Notifications, Profile
│   ├── admin/            # Dashboard, Incidents, IncidentsDetail, Users, Categories, Settings, Notifications, Profile
│   └── dev/              # AuthShowcase, StudentShowcase — internal component preview pages
├── router/               # AppRouter.tsx, ProtectedRoute.tsx
├── hooks/                # one hook per feature (useLogin, useIncidents, useIncidentChat, useAdminUsers, ...)
├── api/                  # axios service modules (authService, incidentService, userService, ...)
├── store/                # authStore.ts (Zustand)
├── types/                # shared TypeScript types per domain
├── schemas/              # zod validation schemas (auth/, student/, manager/)
├── lib/                  # socket.ts (Socket.IO client singleton)
├── constants/             # routes.ts, queryKeys.ts, apiEndpoints.ts
├── config/                # react-query.ts
├── utils/                 # cn.ts, compressImage.ts, plataform.ts
└── components/ui/
    ├── atoms/             # Button, TextInput, StatusBadge, Logo, ...
    ├── molecules/         # FormField, IncidentCard, ChatBubble, Pagination, ...
    ├── organisms/         # LoginForm, IncidentList, ConversationThread, Modal, ...
    └── templates/         # AppLayout, AuthSplitLayout, AuthCenteredLayout
```

## Screens by Role

### Student
| Page | Route |
|---|---|
| My Incidents | `/incidents` |
| Create Incident | `/incidents/create` |
| Incident Detail | `/incidents/:id` |
| Edit Incident | `/incidents/:id/edit` |
| Respond to Manager Request (chat) | `/incidents/:id/conversation` |
| Notifications | `/notifications` |
| Profile | `/profile` |
| Help & FAQ | `/help` |
| About | `/about` |

### Manager
| Page | Route |
|---|---|
| Dashboard | `/manager/dashboard` |
| Incidents | `/manager/incidents` |
| Incident Detail (status change, category correction, internal notes) | `/manager/incidents/:id` |
| Feedback & Response (chat) | `/manager/incidents/:id/conversation` |
| Notifications | `/manager/notifications` |
| Profile | `/manager/profile` |

### Admin
| Page | Route |
|---|---|
| Dashboard | `/admin/dashboard` |
| Incidents | `/admin/incidents` |
| Incident Detail (read-only) | `/admin/incidents/:id` |
| Users | `/admin/users` |
| Categories | `/admin/categories` |
| Settings (general + FAQ tabs) | `/admin/settings` |
| Notifications | `/admin/notifications` |
| Profile | `/admin/profile` |

### Auth / Public
| Page | Route |
|---|---|
| Landing (public) | `/` |
| Login | `/login` |
| Register | `/register` |
| Verify Code (register or password-recovery flow) | `/verify-code` |
| Forgot Password | `/forgot-password` |
| Reset Password | `/reset-password` |
| Microsoft OAuth Callback | `/auth/microsoft/callback` |

## State Management

`store/authStore.ts` is a Zustand store with the `persist` middleware, saved to `localStorage` under the key `auth-storage`. It holds `user`, `accessToken`, `refreshToken`, and exposes `setSession`, `setTokens`, and `logout`. It is read directly by `api/client.ts` (to attach the token), `lib/socket.ts` (to authenticate the socket), and `router/ProtectedRoute.tsx` (to gate routes).

## API Integration

- **Base URL:** `api/client.ts` creates a single axios instance with `baseURL: import.meta.env.VITE_API_URL`.
- **Token attachment:** a request interceptor reads `accessToken` from `authStore` and sets `Authorization: Bearer <token>` on every request.
- **401 handling:** a response interceptor calls `authStore.logout()` and hard-redirects to `/login` on any `401`.
- **Role-based routing:** `router/ProtectedRoute.tsx` reads the current `user` from `authStore`; it redirects unauthenticated users to `/login`, restricts each route to its `allowedRoles` prop, and additionally blocks non-student roles when the app is running as the mobile build (`utils/plataform.ts` → `isMobileApp()`, via Capacitor).

## Real-time

`lib/socket.ts` exports `getSocket()`, a lazy singleton around `socket.io-client`, pointed at `import.meta.env.VITE_SOCKET_URL` (fallback `http://localhost:3000`), authenticated by passing `accessToken` as a `query` parameter, with `autoConnect: false`.

Used exclusively by `hooks/useIncidentChat.ts`:
- **Emits:** `join_incident` (on connect), `send_message`
- **Listens:** `conversationLoaded`, `new_message`, `conversationLocked`, `error`, `connect`, `connect_error`

If the socket fails to connect (or doesn't respond within 2.5s), the hook falls back to a local, non-persisted mock conversation so the chat UI remains usable for demos even without a reachable backend.

## Running Locally

```bash
cd frontend
npm install
npm run dev
```

Dev server: http://localhost:5173. Requires `VITE_API_URL` pointing at a running backend (see [Environment Variables](#environment-variables)).

## Building

```bash
npm run build              # web build → frontend/dist
npm run cap:build:android  # Capacitor sync + Android debug APK (requires Android SDK/Gradle)
npm run electron:build     # Windows installer via electron-builder → frontend/electron-dist
```

## Environment Variables

| Variable | Description | Currently set in `frontend/.env` |
|---|---|---|
| `VITE_API_URL` | Backend REST API base URL | `http://localhost:3000` |
| `VITE_SOCKET_URL` | Socket.IO server URL (read in `lib/socket.ts`, falls back to `http://localhost:3000` if unset) | not set |

Vite variables are baked into the JS bundle at build time — they cannot be changed after the app is built without rebuilding.
