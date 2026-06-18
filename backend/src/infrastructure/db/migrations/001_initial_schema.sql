-- ============================================================================
-- 001_initial_schema.sql
-- UCEConnect — Esquema inicial de base de datos (PostgreSQL)
-- Universidad Central del Ecuador — Plataforma de gestión de incidencias
-- Autor: Adrian Lumbi
-- ============================================================================

-- Roles del sistema (estudiante, gestor, administrador)
CREATE TABLE IF NOT EXISTS roles (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

-- Usuarios de la plataforma
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id       INTEGER REFERENCES roles(id),
    is_active     BOOLEAN DEFAULT true,
    is_verified   BOOLEAN DEFAULT false,
    created_at    TIMESTAMP DEFAULT NOW()
);

-- Códigos de verificación / recuperación enviados por correo
CREATE TABLE IF NOT EXISTS verify_codes (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    code       VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used       BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Categorías de incidencias (académicas, infraestructura, etc.)
CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    is_active   BOOLEAN DEFAULT true
);

-- Incidencias reportadas por los estudiantes
CREATE TABLE IF NOT EXISTS incidents (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    priority    VARCHAR(20) DEFAULT 'medium',
    ai_summary  TEXT,
    status      VARCHAR(20) DEFAULT 'open',
    created_by  INTEGER REFERENCES users(id),
    assigned_to INTEGER REFERENCES users(id),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Historial de cambios de estado de cada incidencia
CREATE TABLE IF NOT EXISTS incident_history (
    id          SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    status      VARCHAR(20) NOT NULL,
    changed_by  INTEGER REFERENCES users(id),
    note        TEXT,
    changed_at  TIMESTAMP DEFAULT NOW()
);

-- Archivos adjuntos a las incidencias (almacenados en Cloudinary)
CREATE TABLE IF NOT EXISTS attachments (
    id             SERIAL PRIMARY KEY,
    incident_id    INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    cloudinary_url VARCHAR(500) NOT NULL,
    file_type      VARCHAR(50),
    uploaded_at    TIMESTAMP DEFAULT NOW()
);

-- Observaciones / comentarios sobre una incidencia
CREATE TABLE IF NOT EXISTS observations (
    id          SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    author_id   INTEGER REFERENCES users(id),
    message     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Notificaciones enviadas a los usuarios
CREATE TABLE IF NOT EXISTS notifications (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    type        VARCHAR(50),
    message     TEXT,
    is_read     BOOLEAN DEFAULT false,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- Datos iniciales
-- ============================================================================

INSERT INTO roles (name) VALUES
    ('student'),
    ('manager'),
    ('admin')
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description, is_active) VALUES
    ('Académico',       'Incidencias relacionadas con clases, docentes o calificaciones', true),
    ('Administrativo',  'Trámites, matrículas y gestión administrativa',                  true),
    ('Infraestructura', 'Problemas con aulas, laboratorios o instalaciones',              true),
    ('Bienestar',       'Salud, seguridad y bienestar estudiantil',                       true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Índices para optimizar las consultas más frecuentes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_incidents_status      ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_created_by  ON incidents(created_by);
CREATE INDEX IF NOT EXISTS idx_incidents_category    ON incidents(category_id);
CREATE INDEX IF NOT EXISTS idx_incidents_assigned_to ON incidents(assigned_to);
CREATE INDEX IF NOT EXISTS idx_notifications_user    ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_history_incident      ON incident_history(incident_id);
