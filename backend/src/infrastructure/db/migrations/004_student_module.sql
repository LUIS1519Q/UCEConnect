ALTER TABLE incidents
  ADD COLUMN IF NOT EXISTS ticket VARCHAR(20),
  ADD COLUMN IF NOT EXISTS status_reason TEXT;

UPDATE incidents
SET ticket = 'INC-' || TO_CHAR(created_at, 'YYYY') || '-' || LPAD(id::TEXT, 4, '0')
WHERE ticket IS NULL;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS faculty_id INTEGER,
  ADD COLUMN IF NOT EXISTS career_id INTEGER,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

CREATE TABLE IF NOT EXISTS faculties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS careers (
  id SERIAL PRIMARY KEY,
  faculty_id INTEGER NOT NULL REFERENCES faculties(id),
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS help_items (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about_info (
  id SERIAL PRIMARY KEY,
  application_name VARCHAR(100) DEFAULT 'UCEConnect',
  version VARCHAR(20) DEFAULT '1.0.0',
  description TEXT,
  institution VARCHAR(200),
  contact_email VARCHAR(100),
  contact_website VARCHAR(200),
  developed_by VARCHAR(200),
  copyright VARCHAR(200),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO about_info (
  application_name, version, description, institution,
  contact_email, contact_website, developed_by, copyright
) VALUES (
  'UCEConnect', '1.0.0',
  'UCEConnect is the official platform for managing academic incidents submitted by students of the Central University of Ecuador.',
  'Central University of Ecuador',
  'support@uceconnect.edu.ec',
  'https://uceconnect.edu.ec',
  'UCEConnect Development Team',
  '© 2026 Central University of Ecuador'
) ON CONFLICT DO NOTHING;

INSERT INTO faculties (name) VALUES
  ('Engineering'),
  ('Health Sciences'),
  ('Law'),
  ('Economics'),
  ('Arts and Humanities')
ON CONFLICT DO NOTHING;

INSERT INTO help_items (question, answer, "order") VALUES
  ('How do I create an incident?', 'Go to New Incident, complete the form and submit your request.', 1),
  ('Can I edit my incident after submitting?', 'Yes. You can edit an incident while its status remains Open.', 2),
  ('How long does it take to get a response?', 'Response times depend on the type of incident and university workload.', 3),
  ('What happens if my incident is rejected?', 'The manager will provide a justification explaining why the incident was rejected.', 4),
  ('How do I respond to a manager request?', 'Open the incident conversation and submit your response together with any additional evidence if required.', 5)
ON CONFLICT DO NOTHING;
