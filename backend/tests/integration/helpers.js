// Reusable fixtures for the integration suite. Each helper creates a
// uniquely-named record (via an internal counter) so tests within the
// same file don't collide, since setup.js only truncates once per file.
const request = require('supertest');
const bcrypt = require('bcrypt');
const { app } = require('../../src/infrastructure/http/server');

let sequence = 0;
function nextSuffix() {
  sequence += 1;
  return `${Date.now()}${sequence}`;
}

const DEFAULT_PASSWORD = 'Password123!';

// Registers a student through the real HTTP endpoint, then flips
// is_verified directly in the DB to skip the email-confirmation flow,
// and finally logs in for a real access token.
async function createStudent(app, overrides = {}) {
  const db = require('../../src/infrastructure/db/connection');
  const suffix = nextSuffix();
  const password = overrides.password || DEFAULT_PASSWORD;

  const payload = {
    firstName: 'Estudiante',
    lastName: 'Prueba',
    email: `student.${suffix}@uce.edu.ec`,
    ...overrides,
    password,
    confirmPassword: password,
  };

  await request(app).post('/api/v1/auth/register').send(payload);
  await db.query('UPDATE users SET is_verified = true WHERE email = $1', [payload.email]);

  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: payload.email, password });

  return { user: loginRes.body.user, token: loginRes.body.accessToken };
}

// Inserts a staff user (manager or admin) straight into the DB — bypasses
// registration entirely, since /auth/register only ever creates students.
async function createStaff(db, roleId, overrides = {}) {
  const suffix = nextSuffix();
  const password = overrides.password || DEFAULT_PASSWORD;
  const firstName = overrides.firstName || (roleId === 3 ? 'Admin' : 'Manager');
  const lastName = overrides.lastName || 'Prueba';
  const email = overrides.email || `${roleId === 3 ? 'admin' : 'manager'}.${suffix}@uce.edu.ec`;
  const passwordHash = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO users (name, first_name, last_name, email, password_hash, role_id, is_active, is_verified)
     VALUES ($1, $2, $3, $4, $5, $6, true, true)`,
    [`${firstName} ${lastName}`, firstName, lastName, email, passwordHash, roleId]
  );

  const loginRes = await request(app).post('/api/v1/auth/login').send({ email, password });

  return { user: loginRes.body.user, token: loginRes.body.accessToken };
}

async function createManager(db, overrides = {}) {
  return createStaff(db, 2, overrides);
}

async function createAdmin(db, overrides = {}) {
  return createStaff(db, 3, overrides);
}

async function createIncident(app, token, overrides = {}) {
  const suffix = nextSuffix();
  const payload = {
    title: `Incidencia de prueba ${suffix}`,
    description: 'Descripcion detallada del problema reportado para propositos de prueba automatizada.',
    ...overrides,
  };

  const res = await request(app)
    .post('/api/v1/incidents')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

  return res.body.incident;
}

async function cleanTable(db, table) {
  await db.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
}

module.exports = {
  createStudent,
  createManager,
  createAdmin,
  createIncident,
  cleanTable,
  DEFAULT_PASSWORD,
};
