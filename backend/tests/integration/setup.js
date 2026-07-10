// Shared DB lifecycle hooks for the integration suite.
// Each *.test.js file requires this module once, which registers a
// beforeAll (clean slate) and an afterAll (close the pg pool) in that
// file's own Jest environment.
const db = require('../../src/infrastructure/db/connection');

beforeAll(async () => {
  await db.query(`
    TRUNCATE TABLE
      notifications,
      observations,
      attachments,
      incident_history,
      incidents,
      password_reset_codes,
      verify_codes,
      users
    RESTART IDENTITY CASCADE
  `);
});

afterAll(async () => {
  await db.pool.end();
});
