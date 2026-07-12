CREATE TABLE IF NOT EXISTS internal_notes (
    id          SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    author_id   INTEGER REFERENCES users(id),
    message     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_internal_notes_incident ON internal_notes(incident_id);
