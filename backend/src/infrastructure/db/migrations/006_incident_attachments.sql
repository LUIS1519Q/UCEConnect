ALTER TABLE attachments
  ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS mime_type         VARCHAR(100) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS size_bytes        INTEGER      NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS uploaded_by       INTEGER REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE attachments ALTER COLUMN original_filename DROP DEFAULT;
ALTER TABLE attachments ALTER COLUMN mime_type DROP DEFAULT;
ALTER TABLE attachments ALTER COLUMN size_bytes DROP DEFAULT;

CREATE INDEX IF NOT EXISTS idx_attachments_incident_id ON attachments(incident_id);
