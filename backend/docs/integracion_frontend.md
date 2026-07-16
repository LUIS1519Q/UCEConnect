# Guía de Integración Backend → Frontend
## Para: Nayeli Guayas — Frontend Developer
## Escrito por: Adrian Lumbi — Backend Developer
## Fecha: julio 2026

---

## Introducción

Nayeli, esto es un mapa completo de cómo el backend expone todo lo que el frontend necesita: endpoints REST con sus campos exactos, el canal de Socket.IO para el chat y las notificaciones en tiempo real, los códigos de error que puede devolver cada cosa, y — la parte más importante — un diagnóstico real de qué está bien conectado hoy y qué le falta un cable. Todo lo que dice esta guía lo verifiqué leyendo el código actual de `routes/`, `controllers/`, `middlewares/`, `sockets/chatHandler.js`, `services/NotificationService.js` y cada caso de uso en `application/`, no es de memoria ni supuestos.

---

## Base URL y configuración de axios

| Entorno | Base URL |
|---|---|
| Local | `http://localhost:3000` |
| QA | `https://uceconnectqa.programacionwebuce.net` |
| Producción | `https://uceconnectprod.programacionwebuce.net` |

- **Authorization header:** cada request autenticado necesita `Authorization: Bearer <accessToken>`. En el cliente axios esto se hace con un interceptor de request que lee el token del store y lo agrega antes de enviar.
- **401 (token expirado o inválido):** `authMiddleware.js` devuelve `401` con `errorCode: 'TOKEN_REQUIRED'` (si no mandaste el header) o `errorCode: 'TOKEN_INVALID'` (si el JWT es inválido o expiró). El interceptor de response debe capturar cualquier `401`, limpiar la sesión y mandar al usuario a `/login`.
- **CORS:** el backend arma el allow-list desde la variable `ALLOWED_ORIGINS` (separada por comas). Si no está seteada, cae a `http://localhost:5173` por defecto. En local ya está en `http://localhost:5173`. Para QA/prod hay que confirmar que `ALLOWED_ORIGINS` en el `.env` del servidor incluya el dominio real del frontend desplegado.

---

## Autenticación

### Login con email/password

`POST /api/v1/auth/login`

Request:
```json
{ "email": "nombre@uce.edu.ec", "password": "..." }
```

Response (200):
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { "id": 1, "firstName": "...", "lastName": "...", "email": "...", "role": "student" }
}
```

`role` viene siempre incluido acá — este endpoint nunca tuvo el bug que sí tenía `GET /auth/me` (ver más abajo). Guardá `user`, `accessToken` y `refreshToken` en `authStore` con `setSession(...)`. Navegá según `user.role`: `student` → `/incidents`, `manager` → `/manager/incidents`, `admin` → `/admin/incidents`.

### Login con Microsoft OAuth

Flujo completo:

1. El frontend redirige a `GET /api/v1/auth/microsoft` (sin body, el backend arma la URL de Azure AD y hace `res.redirect`).
2. El usuario se autentica en Microsoft, Azure redirige a `GET /api/v1/auth/microsoft/callback?code=...`.
3. El backend intercambia el `code`, valida que el email termine en `@uce.edu.ec`, crea el usuario si es la primera vez (rol `student` siempre, `isVerified: true` automático), y redirige al frontend:
   `${FRONTEND_URL}/auth/microsoft/callback?accessToken=...&refreshToken=...&isNewUser=true|false`
4. `MicrosoftCallbackPage` monta `useMicrosoftCallback()`, que lee `accessToken`/`refreshToken` de la query string, los guarda con `setTokens(...)`, y llama a `GET /auth/me` para obtener el perfil completo (incluyendo `role`) antes de navegar al dashboard correcto.

**Bug que existía:** `GET /auth/me` no incluía `role` en la respuesta. Como este flujo depende 100% de `user.role` para decidir a qué dashboard navegar (`DASHBOARD_ROUTES[user.role]`), el usuario quedaba pegado en el spinner de "Signing in..." para siempre — `navigate(undefined)` no hace nada. **Ya está corregido**: `authController.js` ahora arma la respuesta con `role: user.roleName` explícito.

### GET /auth/me

`GET /api/v1/auth/me` (requiere `Authorization`)

Response (200) — confirmado con el fix ya aplicado:
```json
{
  "user": {
    "id": 1,
    "firstName": "...",
    "lastName": "...",
    "email": "...",
    "role": "student",
    "phone": "...",
    "faculty": "Facultad de Ingeniería y Ciencias Aplicadas",
    "career": "Computación",
    "avatarUrl": "https://..."
  }
}
```

Casos de uso: refrescar los datos del usuario sin re-loguear (por ejemplo después de editar el perfil, o justo después del callback de Microsoft).

### Recuperación de contraseña

Flujo de 3 pasos:

1. `POST /api/v1/auth/forgot-password` `{ email }` → envía un código de 6 dígitos por correo (expira en 5 minutos).
2. `POST /api/v1/auth/verify-reset-code` `{ email, code }` → si el código es válido, devuelve `{ message, resetToken }`. Ese `resetToken` es un **JWT de 15 minutos** con `{ email, purpose: 'reset_password' }`, firmado con el mismo `JWT_SECRET`.
3. `POST /api/v1/auth/reset-password` `{ resetToken, newPassword }` → el backend valida el JWT y su `purpose`, y rechaza si la nueva contraseña es igual a la anterior (`errorCode: 'SAME_PASSWORD'`).

El `resetToken` viaja en el `location.state` del router entre `VerifyCodePage` y `ResetPasswordPage` (no en la URL ni en localStorage) — así ya lo tenés armado.

---

## Incidencias

### Para el estudiante

| Método | Path | Qué mostrar en la UI |
|---|---|---|
| GET | `/api/v1/incidents` | Lista completa (sin paginar del lado backend) de los incidentes del estudiante — `{ data: [...] }` |
| POST | `/api/v1/incidents` | Crea el incidente; la respuesta incluye `ticket`, `aiClassified`, `duplicateWarning`, `similarIncidents` (ver abajo) |
| GET | `/api/v1/incidents/:id` | Detalle + `attachments` + `conversationCount` + `timeline`. **Nunca incluye `internalNotes`** cuando el rol es `student` |
| GET | `/api/v1/incidents/:id/observations` | Hilo de conversación (solo si sos el dueño) |
| POST | `/api/v1/incidents/similar` | Búsqueda en vivo mientras escribe el título/descripción |
| GET | `/api/v1/incidents/:id/similar` | Detalle público de un incidente similar de otro estudiante |
| PATCH | `/api/v1/incidents/:id` | Editar título/descripción/categoría — solo si `status === 'open'` y sos el dueño |
| PATCH | `/api/v1/incidents/:id/cancel` | Cancelar — solo si `status === 'open'` |
| POST | `/api/v1/incidents/:id/attachments` | Subir evidencia — solo si `status === 'open'` (para estudiante) |

### Para el gestor/admin

| Método | Path | Roles | Qué mostrar |
|---|---|---|---|
| GET | `/api/v1/incidents` | manager, admin | Paginado (`page`/`limit`, default `limit=5`), filtrable por `status`/`category_id` |
| GET | `/api/v1/incidents/:id` | manager, admin | Incluye `internalNotes` (nunca para student) |
| PATCH | `/api/v1/incidents/:id/status` | manager, admin | Requiere `note` (justificación obligatoria) |
| PATCH | `/api/v1/incidents/:id/category` | manager, admin | Bloqueado si el incidente ya está `resolved`/`rejected`/`cancelled` |
| POST | `/api/v1/incidents/:id/internal-notes` | manager, admin | Nota privada, nunca visible para el estudiante |
| POST | `/api/v1/incidents/:id/attachments` | student, manager, admin | **Ojo:** para manager/admin no hay restricción de estado — pueden adjuntar evidencia en cualquier estado del incidente, a diferencia del estudiante que solo puede mientras está `open` |

### Campos importantes

- **`ticket`:** formato `INC-YYYY-NNNN` (año + id con 4 dígitos, ej. `INC-2026-0007`). Se genera automáticamente justo después del insert, nunca lo mandes vos.
- **`aiClassified`:** `boolean`. `true` si Gemini pudo clasificar el incidente; `false` si falló y se usó el fallback por palabras clave (en ese caso `priority` se calcula con keywords en español tipo "urgente", "crítico", "problema"). Podés mostrar un pequeño badge "Clasificado por IA" solo cuando es `true`.
- **`duplicateWarning` + `similarIncidents`:** al crear un incidente, si el backend detecta que el mismo estudiante ya tiene un incidente `open`/`in_progress` con un título muy parecido (>60% de palabras en común), `duplicateWarning: true` y `similarIncidents` trae los incidentes propios que coinciden.
- **`similarIncidents` en `POST /incidents/similar` (preview mientras escribe):** acá la búsqueda es contra incidentes de **otros** estudiantes, y por seguridad el shape es **solo `{ id, title, status }`** — nunca `description` ni `ticket`. Ojo con esto: en `CreateIncidentPage.tsx`, cuando se arma el objeto para `SimilarIncidentSection`, el campo `status` se está hardcodeando como `"Open"` en vez de usar el `status` real que sí manda el backend — vale la pena revisarlo, porque hoy el backend te da el dato correcto y no se está usando.
- **Transiciones de estado válidas** (`IncidentStatus.js`, exactas):
  - `open` → `in_progress` | `rejected` | `cancelled`
  - `in_progress` → `resolved` | `rejected`
  - `resolved`, `rejected`, `cancelled` → sin salida (terminales)
- **`internalNotes`:** el backend literalmente omite esta clave del JSON completo cuando `role === 'student'` (no la manda como `null` ni vacía, directamente no existe la propiedad) — así que del lado frontend ni siquiera intentes leerla si estás en una página de estudiante.

---

## Socket.io — Chat en tiempo real

### Conexión

- **URL:** local `http://localhost:3000`, QA `https://uceconnectqa.programacionwebuce.net`, prod `https://uceconnectprod.programacionwebuce.net` (mismo host que la API REST, Socket.IO comparte el mismo servidor HTTP).
- **Token:** se pasa en el handshake — el backend acepta `socket.handshake.auth.token`, un header `Authorization`, o `socket.handshake.query.token` (en ese orden de prioridad). Hoy el cliente lo manda como `query: { token: accessToken }`.
- **Sala personal:** al conectar, cada socket se une automáticamente a `user_{userId}` (no hace falta emitir nada para esto, pasa dentro del handler de `connection`). Ahí es donde llegan las notificaciones en tiempo real.

### Eventos que el SERVIDOR emite (frontend debe escuchar)

| Evento | Payload | Cuándo se dispara | Qué hacer |
|---|---|---|---|
| `joined` | `{ incidentId }` | Confirmación después de `join_incident` exitoso | Opcional, hoy no se escucha en el frontend |
| `conversationLoaded` | `{ conversationEnabled, messages, locked?, status?, lockMessage? }` | Justo después de `join_incident` | Cargar el historial completo y el estado de la conversación |
| `new_message` | Observation completa `{ id, incidentId, authorId, authorName, authorRole, message, createdAt }` | Cada vez que alguien manda un mensaje en esa sala | Agregar el mensaje a la lista sin recargar todo |
| `conversationLocked` | `{ event: 'conversationLocked', status, message }` | **Solo en vivo**, cuando alguien cambia el estado a `resolved`/`rejected`/`cancelled` mientras hay gente conectada al incidente (se emite desde `incidentController.js`, no desde `chatHandler.js`) | Bloquear el input, mostrar `payload.message` |
| `error` | `{ message }` (a veces también `{ event: 'error', message }`) | Ver sección de errores de Socket.io más abajo | Mostrar el mensaje al usuario |
| `notification` | Notification completa (ver sección Notificaciones) | Cada vez que se crea una notificación para ese usuario | Actualizar el badge/lista sin hacer polling |

**Ojo con esto:** hay dos caminos distintos para el "candado" de conversación cerrada, y no usan el mismo nombre de campo para el mensaje:
- Si te **reconectás** a un incidente que ya estaba cerrado (`join_incident` → `conversationLoaded`), el candado viene embebido ahí con `lockMessage`.
- Si el cierre pasa **en vivo** mientras ya estás conectado, llega como un evento `conversationLocked` aparte con el campo `message` (no `lockMessage`).

Hoy `useIncidentChat.ts` solo lee `payload.message` en el handler de `conversationLocked`, y nunca lee `payload.lockMessage` dentro de `onConversationLoaded` — por eso al reconectarte a un incidente ya cerrado, `lockedMessage` se queda en `null` (aunque `locked` sí se pone en `true` correctamente). Hoy no se nota porque `RespondToManagerRequestPage.tsx` y `ManagerFeedbackPage.tsx` usan como fallback el mismo texto exacto que manda el backend (`"This conversation is now read-only."`), pero es frágil — si el texto cambia de un lado, se desincroniza del otro.

### Eventos que el FRONTEND debe emitir (servidor escucha)

| Evento | Payload | Cuándo emitirlo | Validación del servidor |
|---|---|---|---|
| `join_incident` | `{ incidentId }` | Al entrar a la página de conversación de un incidente (y también al reconectar) | Verifica que el incidente exista (`error: 'Incident not found'`) y que si sos `student`, seas el dueño (`error: 'You do not have permission'`) |
| `send_message` | `{ incidentId, message }` | Al enviar una respuesta | Ver reglas abajo — hay 3 validaciones antes de guardar el mensaje |

### Reglas importantes

- **El gestor/admin debe escribir primero.** Si sos `student` y todavía ningún `manager`/`admin` respondió en el hilo, el servidor rechaza tu mensaje con `error: { event: 'error', message: 'Conversation is not available yet.' }`.
- **`conversationLocked` se dispara cuando el estado pasa a `resolved`, `rejected` o `cancelled`** (ver arriba, viene de `incidentController.js`).
- **El rol `admin` ya se reconoce como staff** en el chat — está corregido: tanto la validación de "quién ya respondió" como el enrutamiento de notificaciones tratan a `admin` igual que a `manager` (`o.authorRole === 'manager' || o.authorRole === 'admin'`).
- **Eventos `error`:** el servidor los emite en 4 casos — incidente no encontrado, estudiante sin permiso para unirse, incidente sin `manager`/`admin` que haya respondido todavía, o conversación bloqueada (`status !== 'in_progress'`, con mensaje distinto según si es `open` o ya cerrado).

### Ejemplo de flujo completo

1. Estudiante crea el incidente → estado `open`. El chat todavía no está disponible (`conversationEnabled: false`).
2. Un manager entra a la conversación (`join_incident`) → ve el historial vacío.
3. El manager cambia el estado a `in_progress` (`PATCH /:id/status`) → esto **no** habilita el chat automáticamente por sí solo; lo que habilita el envío de mensajes del estudiante es que el manager ya haya mandado al menos un mensaje.
4. El manager manda el primer mensaje (`send_message`) → se guarda, se notifica al estudiante (`manager_request`), y se transmite `new_message` a la sala.
5. El estudiante ya puede responder (`managerReplied` ahora es `true`).
6. El manager resuelve el incidente (`PATCH /:id/status` con `status: 'resolved'`) → se emite `conversationLocked` en vivo a la sala, el chat queda de solo lectura.

---

## Notificaciones

### Tipos de notificación

| type | Cuándo se dispara | Quién la recibe | title de ejemplo |
|---|---|---|---|
| `incident_created` | Al crear un incidente | El propio estudiante creador, **y** cada manager/admin (una notificación por cada uno) | Creador: "Your incident was created successfully." · Staff: "New incident reported: {título}" |
| `status_updated` | Al cambiar el estado (`in_progress`/`resolved`/`rejected`/`cancelled`) | El estudiante creador | Texto específico por estado, ej. "Your incident has been resolved." |
| `student_reply` | El estudiante manda un mensaje en el chat | Todos los managers y admins | "" (usa el `title` del incidente) |
| `manager_request` | Un manager/admin manda un mensaje en el chat | El estudiante creador | "The manager has sent you a message on your incident." |

Payload real de cada notificación (igual en REST y en el evento de socket):
```json
{ "id": 1, "incidentId": 5, "ticket": "INC-2026-0005", "type": "incident_created", "title": "...", "read": false, "createdAt": "..." }
```
(`userId` nunca se incluye en el JSON — el dominio lo oculta a propósito en `toJSON()`.)

### GET /notifications

`GET /api/v1/notifications?page=1&limit=10&unread=true` — paginado, filtro `unread` opcional.
`PATCH /api/v1/notifications/:id/read` — marca como leída (valida que la notificación sea del usuario que la pide).

### Socket.io — evento `notification`

Se emite a la sala personal `user_{userId}` en tiempo real, apenas se guarda en la base (mismo objeto que devuelve la API REST). Para actualizar el badge sin polling, hay que:
1. Tener el socket conectado globalmente (no solo dentro del chat de un incidente).
2. Escuchar `notification` y, al recibirlo, invalidar/refrescar la query de notificaciones.

### Estado actual

**Diagnóstico: el sistema de notificaciones NO está completo.**

- El frontend (`AdminNotificationsPage.tsx`) tiene lógica preparada para 3 tipos que el backend **nunca envía**: `user_registered`, `category_updated`, `settings_changed`. Revisé `CreateUserByAdmin.js`, `CreateCategory.js`, `UpdateCategory.js` y `UpdateSettings.js` — ninguno llama a `notificationService.notify(...)`. Esos 3 tipos están definidos en el `type` de TypeScript del frontend y tienen ruteo armado, pero jamás van a aparecer en la campanita.
- Al revés, los 4 tipos que sí dispara el backend (`incident_created`, `status_updated`, `student_reply`, `manager_request`) sí están todos manejados en el frontend (student, manager y admin).
- El evento `notification` de socket solo tiene efecto real si el socket está conectado — y hoy el socket únicamente se conecta cuando estás dentro de la página de chat de un incidente puntual (`useIncidentChat`). Si estás en cualquier otra pantalla (dashboard, notificaciones, perfil), no hay conexión activa, así que en la práctica las notificaciones en tiempo real solo llegan a los que ya están dentro de una conversación — para todos los demás casos el badge depende del polling cada 30s de `useUnreadNotificationsCount`.

---

## Dashboard y Reportes (solo gestor/admin)

| Método | Path | Roles | Query params | Response |
|---|---|---|---|---|
| GET | `/api/v1/dashboard` | manager, admin | `days` (1–90, default 30) | `{ metrics: {open, in_progress, resolved, rejected, cancelled, total}, trend, recentIncidents: [...10] }` |
| GET | `/api/v1/reports/monthly` | admin | `month` (`YYYY-MM`, opcional — default mes actual) | `{ month, metrics, categoryBreakdown, summaryText }` — `summaryText` lo genera Gemini, con fallback a un párrafo armado a mano si la IA falla |
| GET | `/api/v1/reports/monthly/pdf` | admin | `month` | Descarga binaria `application/pdf` |
| GET | `/api/v1/reports/monthly/excel` | admin | `month` | Descarga binaria `.xlsx` |

---

## Administración (solo admin)

| Método | Path | Response | Comportamiento especial |
|---|---|---|---|
| POST | `/api/v1/users` | `{ message, user }` | Crea al usuario ya verificado con una contraseña aleatoria descartable, envía un email de bienvenida (`sendAdminWelcome`) **y además dispara el flujo de "olvidé mi contraseña"** para que le llegue un segundo correo con el código para poner su propia contraseña |
| GET | `/api/v1/users` | `{ data, pagination: {page, limit, total} }` | `limit` se cachea internamente a un máximo de 50 aunque pidas más |
| PATCH | `/api/v1/users/:id/manage` | `{ message, user }` | Podés mandar `role` y/o `isActive`, por separado o juntos |

---

## Catálogos

| Método | Path | Response | Cuándo llamarlo |
|---|---|---|---|
| GET | `/api/v1/faculties` | `{ data: [{id, name}, ...] }` (21 facultades) | Al montar el formulario de perfil/registro extendido — no depende de nada más |
| GET | `/api/v1/careers?facultyId=` | `{ data: [{id, name}, ...] }` | Bajo demanda, recién cuando el usuario elige una facultad (`enabled: !!facultyId`) |
| GET | `/api/v1/help` | `{ pageTitle, pageDescription, supportEmail, items: [...] }` | Al montar la pantalla de Ayuda/FAQ |
| GET | `/api/v1/about` | `{ applicationName, version, description, institution, contact: {email, website}, developedBy, copyright, logoUrl }` | Al montar la pantalla "Acerca de" |

---

## Manejo de errores

### Formato estándar de error

```json
{ "message": "texto legible", "errorCode": "ALGUN_CODIGO" }
```

Todos los `errorCode` que puede devolver el backend hoy:

| errorCode | De dónde sale |
|---|---|
| `TOKEN_REQUIRED` | Falta el header `Authorization` |
| `TOKEN_INVALID` | JWT inválido o expirado |
| `INSUFFICIENT_ROLE` | El rol del usuario no está permitido en esa ruta |
| `EMAIL_ALREADY_REGISTERED` | Registro / creación admin con email ya existente |
| `INVALID_EMAIL_DOMAIN` | Email no termina en `@uce.edu.ec` |
| `CODE_NOT_FOUND` | Código de verificación/reset no existe |
| `CODE_EXPIRED` | Código expirado (5 min) |
| `CODE_ALREADY_USED` | Código ya fue usado |
| `INVALID_CODE` | Código no coincide |
| `INVALID_CREDENTIALS` | Login con email/password incorrectos |
| `EMAIL_NOT_VERIFIED` | Login sin haber verificado el correo |
| `USER_DISABLED` | Cuenta desactivada |
| `USER_NOT_FOUND` | Usuario no existe |
| `INVALID_RESET_TOKEN` | `resetToken` inválido/expirado |
| `SAME_PASSWORD` | La nueva contraseña es igual a la anterior |
| `MICROSOFT_AUTH_ERROR` | Falla al iniciar el flujo de Microsoft |
| `AUTH_CODE_REQUIRED` | Callback de Microsoft sin `code` |
| `ALREADY_VERIFIED` | Reenviar código a una cuenta ya verificada |
| `VALIDATION_ERROR` | Errores de negocio varios (perfil, avatar, adjuntos, categorías, settings) |
| `INCIDENT_NOT_FOUND` | Incidente no existe |
| `INSUFFICIENT_PERMISSION` | No sos el dueño del recurso |
| `BUSINESS_RULE_VIOLATION` | Ej. editar un incidente que no está `open` |
| `INVALID_TRANSITION` | Cambio de estado no permitido |
| `CATEGORY_NOT_FOUND` | Categoría no existe |
| `NOTIFICATION_NOT_FOUND` | Notificación no existe |
| `FAQ_ITEM_NOT_FOUND` | Pregunta de FAQ no existe |
| `INTERNAL_ERROR` | Cualquier error no controlado (500) |

### Errores de Multer (uploads)

Hay **dos comportamientos distintos** dependiendo de qué ruta de subida falla — esto es importante que lo manejes diferente:

- **`POST /:id/attachments`** (adjuntos de incidentes): el middleware `uploadAttachments` en `uploadMiddleware.js` **sí envuelve el error de Multer** y devuelve el formato estándar: `{ message, errorCode: 'VALIDATION_ERROR' }` con status `400`. Podés tratarlo igual que cualquier otro error de validación.
- **`PATCH /me/avatar`** y **`POST /settings/logo`** (avatar/logo): estas rutas usan `upload.single(...)` directo, sin ningún wrapper — si Multer rechaza el archivo (tipo no permitido o pesa más de 5MB), el error **no** pasa por ningún controller, cae directo al error handler global de Express, que devuelve **`{ status: 'error', message }` — sin `errorCode`, y encima con status `500`** en vez de `400`. Si tu código de manejo de errores busca `err.response.data.errorCode` para decidir qué mostrar, en este caso específico vas a recibir `undefined` — tenés que tener un fallback que solo mire `message`.

### Errores de Socket.io

El servidor emite el evento `error` con `{ message }` (a veces con `event: 'error'` también) en estos casos exactos:
- `join_incident` a un incidente que no existe.
- `join_incident` como estudiante a un incidente que no es tuyo.
- `send_message` a un incidente que no existe.
- `send_message` cuando el incidente todavía está `open` (nadie del staff respondió) → `"Conversation is not available yet."`.
- `send_message` cuando el incidente ya está cerrado → `"This conversation is read-only."`.
- `send_message` como estudiante antes de que un manager/admin haya respondido → `"Conversation is not available yet."`.
- Cualquier excepción no controlada dentro de los handlers (se manda `err.message` tal cual, sin traducir).

---

## Variables de entorno necesarias en el frontend

| Variable | Local | QA | Producción |
|---|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | `https://uceconnectqa.programacionwebuce.net` | `https://uceconnectprod.programacionwebuce.net` |
| `VITE_SOCKET_URL` | `http://localhost:3000` | `https://uceconnectqa.programacionwebuce.net` | `https://uceconnectprod.programacionwebuce.net` |

---

## Checklist de integración

- [x] Auth login
- [x] Microsoft OAuth callback (faltaba `role` — ya corregido)
- [x] GET /auth/me (`role` ya incluido)
- [x] Incidents estudiante
- [x] Incidents gestor/admin
- [x] Attachments
- [x] Conexión Socket.io
- [x] Eventos Socket.io (todos escuchados, con la salvedad del `lockMessage` en `conversationLoaded` — ver Issues)
- [ ] Notificaciones en tiempo real — solo funcionan mientras estás dentro de un chat; el resto del tiempo es polling
- [x] Notificaciones REST
- [x] Dashboard
- [x] Descarga de reportes
- [x] Admin usuarios
- [x] Categorías
- [ ] Settings — el formulario general no manda los campos que el backend realmente espera
- [x] FAQ
- [x] Catálogos

---

## Issues encontrados durante el diagnóstico

1. **Notificaciones que el frontend maneja pero el backend nunca dispara.**
   Descripción: `AdminNotificationsPage.tsx` tiene rutas y labels para `user_registered`, `category_updated`, `settings_changed`, pero ningún caso de uso del backend (`CreateUserByAdmin`, `CreateCategory`, `UpdateCategory`, `UpdateSettings`) llama a `notificationService.notify(...)`.
   Responsable: BACKEND (falta implementarlo) — o alternativamente FRONTEND si se decide no soportarlos.
   Estado: PENDIENTE.
   Fix sugerido: agregar `notificationService.notify({ type: 'user_registered', ... })` (y equivalentes) en los 3 casos de uso, dirigido a los admins.

2. **`conversationLoaded` no propaga `lockMessage` al frontend.**
   Descripción: al reconectarte a un incidente ya cerrado, el backend manda `lockMessage` dentro de `conversationLoaded`, pero `useIncidentChat.ts` nunca lo lee en `onConversationLoaded` (solo lee `payload.locked`). El evento en vivo `conversationLocked` sí funciona porque usa el campo `message`, que sí se lee.
   Responsable: FRONTEND.
   Estado: PENDIENTE (hoy no se nota porque el fallback hardcodeado coincide con el texto real).
   Fix sugerido: agregar `setLockedMessage(payload.lockMessage ?? null)` dentro de `onConversationLoaded`.

3. **`similarIncidents` en el preview de creación siempre muestra "Open".**
   Descripción: el backend manda el `status` real del incidente similar en `POST /incidents/similar`, pero `CreateIncidentPage.tsx` arma el objeto para `SimilarIncidentSection` con `status: "Open"` hardcodeado en vez de usar `firstSimilar.status`.
   Responsable: FRONTEND.
   Estado: PENDIENTE.

4. **El formulario general de Settings no coincide con el schema real del backend.**
   Descripción: `AdminSettingsPage.tsx` (y `types/settings.ts`/`settingsService.ts`) usan `maxFileSize`/`allowedFileTypes`, pero `PATCH /api/v1/settings` solo reconoce `maxFilesPerUpload`, `maxImageSizeBytes`, `maxDocumentSizeBytes`, `maxVideoSizeBytes`, `allowedImageTypes`, `allowedDocumentTypes`, `allowedVideoTypes`. Esos dos campos se descartan silenciosamente al guardar.
   Responsable: FRONTEND.
   Estado: PENDIENTE.

5. **Categorías hardcodeadas en la corrección de categoría del gestor.**
   Descripción: `ManagerIncidentDetailPage.tsx` usa una lista fija (`Academic`/`Financial`/`Systems`/`Other`, ids 1–4) en vez de pedir `GET /api/v1/categories`. Los nombres reales sembrados son distintos (`Académico`, `Administrativo`, `Infraestructura`, `Bienestar`).
   Responsable: FRONTEND.
   Estado: PENDIENTE.

6. **Errores de subida de avatar/logo no tienen `errorCode` y devuelven 500 en vez de 400.**
   Descripción: a diferencia de `/attachments` (que sí envuelve el error de Multer con el formato estándar), `PATCH /me/avatar` y `POST /settings/logo` usan `upload.single(...)` sin wrapper, así que un archivo rechazado cae al error handler global (`{status:'error', message}`, sin `errorCode`, status 500).
   Responsable: BACKEND.
   Estado: PENDIENTE.
   Fix sugerido: envolver esas dos rutas con el mismo patrón de `uploadAttachments` (capturar el error de Multer explícitamente y devolver 400 + `errorCode: 'VALIDATION_ERROR'`).

7. **`GET /auth/me` sin `role` (rompía el login por Microsoft).**
   Responsable: BACKEND.
   Estado: **FIXED** — `authController.js` ya incluye `role: user.roleName`.

8. **`findSimilar` devolvía la lista bajo la clave `data` en vez de `similarIncidents`.**
   Responsable: BACKEND.
   Estado: **FIXED** — `incidentController.js` ya devuelve `{ similarIncidents: results }`, alineado con lo que espera `SimilarIncidentResponse` en el frontend.
