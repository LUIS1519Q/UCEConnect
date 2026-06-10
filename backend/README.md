# UCEConnect — Backend

API REST para la gestión de incidencias estudiantiles de la Universidad Central del Ecuador. Permite a los estudiantes reportar incidencias académicas y a gestores/administradores darles seguimiento, asignarlas y resolverlas.

---

## Arquitectura

Este proyecto sigue **Domain-Driven Design (DDD)** combinado con **Arquitectura Hexagonal** (Puertos y Adaptadores).

```
backend/
└── src/
    ├── domain/           # Lógica de negocio — sin dependencias externas
    │   ├── incidents/
    │   ├── users/
    │   ├── notifications/
    │   └── shared/
    ├── application/      # Casos de uso — orquesta la lógica del dominio
    │   ├── incidents/
    │   ├── users/
    │   └── notifications/
    └── infrastructure/   # Adaptadores — Express, PostgreSQL, OpenAI, Cloudinary
        ├── db/
        ├── repositories/
        ├── services/
        └── http/
```

**Regla de dependencia:** Domain ← Application ← Infrastructure. La capa de dominio nunca importa Express, pg, ni ninguna librería externa.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Base de datos | PostgreSQL |
| Autenticación | JWT + refresh tokens |
| Clasificación con IA | OpenAI |
| Almacenamiento de archivos | Cloudinary |
| Contenedores | Docker / Docker Compose |

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
| `npm run dev` | Levanta el servidor en modo desarrollo (nodemon) |
| `npm start` | Levanta el servidor en modo producción |
| `npm test` | Ejecuta la suite de pruebas (Jest) |
| `npm run test:watch` | Ejecuta las pruebas en modo watch |
| `npm run test:coverage` | Ejecuta las pruebas con reporte de cobertura |
| `npm run docker:local` | Levanta PostgreSQL + backend con Docker Compose |
| `npm run docker:local:down` | Detiene los contenedores locales |
| `npm run docker:local:logs` | Muestra los logs de los contenedores locales |
| `npm run docker:build` | Construye la imagen Docker `wadri/uceconnect-backend:dev` |
| `npm run docker:push` | Publica la imagen en Docker Hub |

---

## Autor

**Adrian Lumbi** — Backend & Base de datos

*Universidad Central del Ecuador — Programación Web 2026*
