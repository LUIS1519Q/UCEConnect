const request = require('supertest');
const { app } = require('../../src/infrastructure/http/server');
const { createStudent } = require('./helpers');

require('./setup');

describe('GET /api/v1/faculties', () => {
  test('200 — returns 21 UCE faculties', async () => {
    const { token } = await createStudent(app);

    const res = await request(app).get('/api/v1/faculties').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(21);
  });

  test('401 — TOKEN_REQUIRED without token', async () => {
    const res = await request(app).get('/api/v1/faculties');

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('TOKEN_REQUIRED');
  });
});

describe('GET /api/v1/careers?facultyId=1', () => {
  test('200 — returns careers for faculty', async () => {
    const { token } = await createStudent(app);

    const res = await request(app)
      .get('/api/v1/careers')
      .query({ facultyId: 1 })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('400 — VALIDATION_ERROR without facultyId', async () => {
    const { token } = await createStudent(app);

    const res = await request(app).get('/api/v1/careers').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.errorCode).toBe('VALIDATION_ERROR');
  });

  test('401 — TOKEN_REQUIRED without token', async () => {
    const res = await request(app).get('/api/v1/careers').query({ facultyId: 1 });

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('TOKEN_REQUIRED');
  });
});

describe('GET /api/v1/help', () => {
  test('200 — returns pageTitle and items array', async () => {
    const { token } = await createStudent(app);

    const res = await request(app).get('/api/v1/help').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.pageTitle).toBeDefined();
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  test('200 — items have question, answer, order fields', async () => {
    const { token } = await createStudent(app);

    const res = await request(app).get('/api/v1/help').set('Authorization', `Bearer ${token}`);

    if (res.body.items.length > 0) {
      expect(res.body.items[0]).toEqual(
        expect.objectContaining({
          question: expect.any(String),
          answer: expect.any(String),
          order: expect.any(Number),
        })
      );
    }
  });

  test('401 — TOKEN_REQUIRED without token', async () => {
    const res = await request(app).get('/api/v1/help');

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('TOKEN_REQUIRED');
  });
});

describe('GET /api/v1/about', () => {
  test('200 — returns applicationName UCEConnect', async () => {
    const { token } = await createStudent(app);

    const res = await request(app).get('/api/v1/about').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.applicationName).toBe('UCEConnect');
  });

  test('200 — returns version, description, institution', async () => {
    const { token } = await createStudent(app);

    const res = await request(app).get('/api/v1/about').set('Authorization', `Bearer ${token}`);

    expect(res.body.version).toBeDefined();
    expect(res.body.description).toBeDefined();
    expect(res.body.institution).toBeDefined();
  });

  test('401 — TOKEN_REQUIRED without token', async () => {
    const res = await request(app).get('/api/v1/about');

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('TOKEN_REQUIRED');
  });
});
