# UCEConnect — Backend

API REST para la gestión de incidencias estudiantiles de la Universidad Central del Ecuador. Permite a los estudiantes reportar incidencias académicas y a gestores/administradores darles seguimiento, asignarlas y resolverlas.

---

## Arquitectura

Este proyecto sigue **Domain-Driven Design (DDD)** combinado con **Arquitectura Hexagonal** (Puertos y Adaptadores).

```
backend/
└── src/
    ├── domain/           # Lógica de negocio pura — sin dependencias externas
    │   ├── incidents/    # Incident, IncidentStatus (Value Object), IIncidentRepo
    │   ├── users/        # User, IUserRepo, IEmailNotifier
    │   ├── notifications/
    │   └── shared/
    ├── application/      # Casos de uso — orquesta el dominio
    │   ├── incidents/    # CreateIncident, ListIncidents, GetIncidentById, UpdateStatus
    │   └── users/        # RegisterUser, LoginUser, VerifyCode
    └── infrastructure/   # Adaptadores — Express, PostgreSQL, Nodemailer
        ├── db/           # Conexión al pool de PostgreSQL
        ├── repositories/ # PostgresIncidentRepo, PostgresUserRepo
        ├── services/     # NodemailerEmailNotifier
        └── http/
            ├── controllers/
            ├── middlewares/  # authMiddleware, roleMiddleware
            └── routes/       # authRoutes, incidentRoutes
```

**Regla de dependencia:** Domain ← Application ← Infrastructure. El dominio nunca importa Express, pg ni ninguna librería externa.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Base de datos | PostgreSQL |
| Autenticación | JWT (access token 1h + refresh token 7d) |
| Validación | Zod |
| Logging | Winston |
| Email | Nodemailer (SMTP Gmail) |
| Contenedores | Docker / Docker Compose |

---

## Endpoints implementados

### Auth — `/api/v1/auth`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/register` | Público | Registra un usuario y envía código de verificación |
| POST | `/verify-code` | Público | Verifica el código de 6 dígitos enviado por correo |
| POST | `/login` | Público | Inicia sesión y retorna `accessToken` + `refreshToken` |
| GET | `/me` | Autenticado | Retorna el payload del JWT activo |

### Incidents — `/api/v1/incidents`

| Método | Ruta | Rol requerido | Descripción |
|---|---|---|---|
| GET | `/` | Cualquier rol | Lista incidencias (student ve solo las suyas) |
| POST | `/` | student | Crea una nueva incidencia |
| GET | `/:id` | Cualquier rol | Detalle de una incidencia + historial de estados |
| PATCH | `/:id/status` | manager, admin | Cambia el estado de una incidencia |

### Estados y transiciones válidas

```
open → in_progress → resolved
                   → rejected
open → rejected
```

Las transiciones son unidireccionales y las valida el Value Object `IncidentStatus` en el dominio.

---

## Roles

| Rol | Permisos |
|---|---|
| `student` | Crear incidencias, ver solo las propias |
| `manager` | Ver todas, cambiar estado, asignar |
| `admin` | Acceso total |

El rol viaja firmado en el JWT y es verificado por `authMiddleware` + `roleMiddleware` en cada ruta protegida.

---

## Puesta en marcha (entorno local)

1. Copiar `.env.example` a `.env` y completar las variables.
2. Levantar PostgreSQL + backend con Docker:
   ```bash
   npm run docker:local
   ```
3. Verificar que el servicio responde en [http://localhost:3000/health](http://localhost:3000/health).

### Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor en modo desarrollo (nodemon) |
| `npm start` | Servidor en modo producción |
| `npm test` | Suite de pruebas (Jest) |
| `npm run test:watch` | Pruebas en modo watch |
| `npm run test:coverage` | Pruebas con reporte de cobertura |
| `npm run docker:local` | Levanta PostgreSQL + backend con Docker Compose |
| `npm run docker:local:down` | Detiene los contenedores locales |
| `npm run docker:local:logs` | Logs de los contenedores locales |
| `npm run docker:build` | Construye la imagen Docker |
| `npm run docker:push` | Publica la imagen en Docker Hub |

---

## Variables de entorno requeridas

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `JWT_SECRET` | Secreto para firmar access tokens |
| `JWT_REFRESH_SECRET` | Secreto para firmar refresh tokens |
| `EMAIL_USER` | Cuenta SMTP de Gmail |
| `EMAIL_PASS` | App password de Gmail |
| `FRONTEND_URL` | URL del frontend (para CORS) |
| `PORT` | Puerto del servidor (default: 3000) |

---

## Autor

**Adrian Lumbi** — Backend & Base de datos

*Universidad Central del Ecuador — Programación Web 2026*
