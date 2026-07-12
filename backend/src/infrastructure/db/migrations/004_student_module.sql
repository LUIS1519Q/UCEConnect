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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'faculties_name_unique'
  ) THEN
    ALTER TABLE faculties
      ADD CONSTRAINT faculties_name_unique UNIQUE (name);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'careers_faculty_name_unique'
  ) THEN
    ALTER TABLE careers
      ADD CONSTRAINT careers_faculty_name_unique UNIQUE (faculty_id, name);
  END IF;
END $$;

INSERT INTO faculties (name) VALUES
  ('Facultad de Artes'),
  ('Facultad de Arquitectura y Urbanismo'),
  ('Facultad de Ciencias'),
  ('Facultad de Ciencias Administrativas'),
  ('Facultad de Ciencias Agrícolas'),
  ('Facultad de Ciencias Biológicas'),
  ('Facultad de Ciencias de la Discapacidad, Atención Prehospitalaria y Desastres'),
  ('Facultad de Ciencias Económicas'),
  ('Facultad de Ciencias Médicas'),
  ('Facultad de Ciencias Psicológicas'),
  ('Facultad de Ciencias Químicas'),
  ('Facultad de Ciencias Sociales y Humanas'),
  ('Facultad de Comunicación Social'),
  ('Facultad de Cultura Física'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación'),
  ('Facultad de Ingeniería y Ciencias Aplicadas'),
  ('Facultad de Ingeniería en Geología, Minas, Petróleos y Ambiental'),
  ('Facultad de Ingeniería Química'),
  ('Facultad de Jurisprudencia, Ciencias Políticas y Sociales'),
  ('Facultad de Medicina Veterinaria y Zootecnia'),
  ('Facultad de Odontología')
ON CONFLICT DO NOTHING;

INSERT INTO careers (faculty_id, name)
SELECT f.id, c.name
FROM (VALUES
  ('Facultad de Artes', 'Artes Escénicas'),
  ('Facultad de Artes', 'Artes Musicales'),
  ('Facultad de Artes', 'Artes Plásticas'),
  ('Facultad de Artes', 'Danza'),
  ('Facultad de Arquitectura y Urbanismo', 'Arquitectura'),
  ('Facultad de Ciencias', 'Ingeniería Matemática'),
  ('Facultad de Ciencias Administrativas', 'Administración de Empresas'),
  ('Facultad de Ciencias Administrativas', 'Administración Pública'),
  ('Facultad de Ciencias Administrativas', 'Contabilidad y Auditoría'),
  ('Facultad de Ciencias Agrícolas', 'Agronomía'),
  ('Facultad de Ciencias Agrícolas', 'Turismo'),
  ('Facultad de Ciencias Biológicas', 'Ciencias Biológicas'),
  ('Facultad de Ciencias Biológicas', 'Ingeniería en Recursos Naturales'),
  ('Facultad de Ciencias de la Discapacidad, Atención Prehospitalaria y Desastres', 'Fisioterapia'),
  ('Facultad de Ciencias de la Discapacidad, Atención Prehospitalaria y Desastres', 'Fonoaudiología'),
  ('Facultad de Ciencias de la Discapacidad, Atención Prehospitalaria y Desastres', 'Terapia Ocupacional'),
  ('Facultad de Ciencias de la Discapacidad, Atención Prehospitalaria y Desastres', 'Atención Prehospitalaria'),
  ('Facultad de Ciencias Económicas', 'Economía'),
  ('Facultad de Ciencias Económicas', 'Ingeniería Estadística'),
  ('Facultad de Ciencias Económicas', 'Finanzas'),
  ('Facultad de Ciencias Médicas', 'Medicina'),
  ('Facultad de Ciencias Médicas', 'Enfermería'),
  ('Facultad de Ciencias Médicas', 'Obstetricia'),
  ('Facultad de Ciencias Médicas', 'Laboratorio Clínico'),
  ('Facultad de Ciencias Médicas', 'Imagenología y Radiología'),
  ('Facultad de Ciencias Psicológicas', 'Licenciatura en Psicología'),
  ('Facultad de Ciencias Psicológicas', 'Licenciatura en Psicología Clínica'),
  ('Facultad de Ciencias Químicas', 'Química'),
  ('Facultad de Ciencias Químicas', 'Bioquímica y Farmacia'),
  ('Facultad de Ciencias Sociales y Humanas', 'Política'),
  ('Facultad de Ciencias Sociales y Humanas', 'Sociología'),
  ('Facultad de Ciencias Sociales y Humanas', 'Trabajo Social'),
  ('Facultad de Comunicación Social', 'Comunicación Social'),
  ('Facultad de Comunicación Social', 'Turismo Histórico'),
  ('Facultad de Cultura Física', 'Pedagogía de la Actividad Física y Deporte'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Educación Inicial'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Multilingüe'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Pedagogía de los Idiomas Nacionales y Extranjeros'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Psicología Educativa y Orientación'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Pedagogía de la Historia y las Ciencias Sociales'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Comercio y Administración'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Pedagogía de las Ciencias Experimentales Química y Biología'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Pedagogía de las Ciencias Experimentales Informática'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Pedagogía de las Ciencias Experimentales Matemática y Física'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Pedagogía de la Lengua y Literatura'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Psicopedagogía'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Educación Básica'),
  ('Facultad de Filosofía, Letras y Ciencias de la Educación', 'Pedagogía Técnica de la Mecatrónica'),
  ('Facultad de Ingeniería y Ciencias Aplicadas', 'Ingeniería Civil'),
  ('Facultad de Ingeniería y Ciencias Aplicadas', 'Diseño Industrial'),
  ('Facultad de Ingeniería y Ciencias Aplicadas', 'Computación'),
  ('Facultad de Ingeniería y Ciencias Aplicadas', 'Sistemas de Información'),
  ('Facultad de Ingeniería en Geología, Minas, Petróleos y Ambiental', 'Ingeniería en Petróleos'),
  ('Facultad de Ingeniería en Geología, Minas, Petróleos y Ambiental', 'Ingeniería Ambiental'),
  ('Facultad de Ingeniería en Geología, Minas, Petróleos y Ambiental', 'Ingeniería en Geología'),
  ('Facultad de Ingeniería en Geología, Minas, Petróleos y Ambiental', 'Ingeniería de Minas'),
  ('Facultad de Ingeniería Química', 'Ingeniería Química'),
  ('Facultad de Jurisprudencia, Ciencias Políticas y Sociales', 'Derecho'),
  ('Facultad de Jurisprudencia, Ciencias Políticas y Sociales', 'Ciencias Policiales'),
  ('Facultad de Jurisprudencia, Ciencias Políticas y Sociales', 'Instituto de Criminología'),
  ('Facultad de Medicina Veterinaria y Zootecnia', 'Medicina Veterinaria y Zootecnia'),
  ('Facultad de Odontología', 'Odontología')
) AS c(faculty_name, name)
JOIN faculties f ON f.name = c.faculty_name
ON CONFLICT DO NOTHING;

INSERT INTO help_items (question, answer, "order") VALUES
  ('How do I create an incident?', 'Go to New Incident, complete the form and submit your request.', 1),
  ('Can I edit my incident after submitting?', 'Yes. You can edit an incident while its status remains Open.', 2),
  ('How long does it take to get a response?', 'Response times depend on the type of incident and university workload.', 3),
  ('What happens if my incident is rejected?', 'The manager will provide a justification explaining why the incident was rejected.', 4),
  ('How do I respond to a manager request?', 'Open the incident conversation and submit your response together with any additional evidence if required.', 5)
ON CONFLICT DO NOTHING;
