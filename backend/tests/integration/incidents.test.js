const request = require('supertest');
const { app } = require('../../src/infrastructure/http/server');
const db = require('../../src/infrastructure/db/connection');
const { createStudent, createManager, createIncident } = require('./helpers');

require('./setup');

describe('POST /api/v1/incidents', () => {
  test('201 — creates incident without categoryId', async () => {
    const { token } = await createStudent(app);

    const res = await request(app)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'No puedo acceder al sistema academico', description: 'El sistema academico no carga desde ayer.' });

    expect(res.status).toBe(201);
    expect(res.body.incident.title).toBe('No puedo acceder al sistema academico');
  });

  test('201 — returns ticket in INC-YYYY-XXXX format', async () => {
    const { token } = await createStudent(app);

    const res = await request(app)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Problema con la plataforma virtual', description: 'La plataforma virtual no permite iniciar sesion.' });

    expect(res.body.incident.ticket).toMatch(/^INC-\d{4}-\d{4,}$/);
  });

  test('201 — aiClassified is boolean', async () => {
    const { token } = await createStudent(app);

    const res = await request(app)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Fallo en el registro de matricula', description: 'No se pudo completar el proceso de matricula.' });

    expect(typeof res.body.incident.aiClassified).toBe('boolean');
  });

  test('201 — duplicateWarning true on duplicate title', async () => {
    const { token } = await createStudent(app);
    const title = 'Problema grave con el sistema de calificaciones';
    const description = 'Las calificaciones no se reflejan correctamente en el sistema.';

    await request(app)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send({ title, description });

    const res = await request(app)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send({ title, description: 'Segundo reporte sobre el mismo problema de calificaciones.' });

    expect(res.body.incident.duplicateWarning).toBe(true);
  });

  test('400 — validation error with short title (< 5 chars)', async () => {
    const { token } = await createStudent(app);

    const res = await request(app)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'abcd', description: 'Descripcion valida con mas de diez caracteres.' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('title');
  });

  test('400 — validation error with short description (< 10 chars)', async () => {
    const { token } = await createStudent(app);

    const res = await request(app)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Titulo valido de prueba', description: 'corta' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('description');
  });

  test('403 — INSUFFICIENT_ROLE for manager trying to create', async () => {
    const { token } = await createManager(db);

    const res = await request(app)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Titulo valido de prueba', description: 'Descripcion valida con mas de diez caracteres.' });

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('INSUFFICIENT_ROLE');
  });

  test('401 — TOKEN_REQUIRED without token', async () => {
    const res = await request(app)
      .post('/api/v1/incidents')
      .send({ title: 'Titulo valido de prueba', description: 'Descripcion valida con mas de diez caracteres.' });

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('TOKEN_REQUIRED');
  });
});

describe('GET /api/v1/incidents', () => {
  test('200 — student sees only own incidents (no pagination)', async () => {
    const { token } = await createStudent(app);
    await createIncident(app, token);

    const res = await request(app).get('/api/v1/incidents').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('200 — student response has no pagination object', async () => {
    const { token } = await createStudent(app);
    await createIncident(app, token);

    const res = await request(app).get('/api/v1/incidents').set('Authorization', `Bearer ${token}`);

    expect(res.body.pagination).toBeUndefined();
  });

  test('200 — manager sees all incidents with pagination', async () => {
    const { token: studentToken } = await createStudent(app);
    await createIncident(app, studentToken);
    const { token: managerToken } = await createManager(db);

    const res = await request(app).get('/api/v1/incidents').set('Authorization', `Bearer ${managerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  test('200 — manager response has pagination object', async () => {
    const { token: managerToken } = await createManager(db);

    const res = await request(app).get('/api/v1/incidents').set('Authorization', `Bearer ${managerToken}`);

    expect(res.body.pagination).toMatchObject({
      page: expect.any(Number),
      limit: expect.any(Number),
      total: expect.any(Number),
    });
  });

  test('200 — default limit is 5 for manager', async () => {
    const { token: managerToken } = await createManager(db);

    const res = await request(app).get('/api/v1/incidents').set('Authorization', `Bearer ${managerToken}`);

    expect(res.body.pagination.limit).toBe(5);
  });

  test('200 — filters by status=open correctly', async () => {
    const { token: studentToken } = await createStudent(app);
    await createIncident(app, studentToken);
    const { token: managerToken } = await createManager(db);

    const res = await request(app)
      .get('/api/v1/incidents')
      .query({ status: 'open' })
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.every((incident) => incident.status === 'open')).toBe(true);
  });

  test('200 — filters by status=cancelled correctly', async () => {
    const { token: studentToken } = await createStudent(app);
    const incident = await createIncident(app, studentToken);
    await request(app)
      .patch(`/api/v1/incidents/${incident.id}/cancel`)
      .set('Authorization', `Bearer ${studentToken}`);
    const { token: managerToken } = await createManager(db);

    const res = await request(app)
      .get('/api/v1/incidents')
      .query({ status: 'cancelled' })
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.some((i) => i.id === incident.id)).toBe(true);
    expect(res.body.data.every((i) => i.status === 'cancelled')).toBe(true);
  });

  test('200 — manager page=2 returns correct hasPrev=true', async () => {
    const { token: studentToken } = await createStudent(app);
    await createIncident(app, studentToken);
    await createIncident(app, studentToken);
    const { token: managerToken } = await createManager(db);

    const res = await request(app)
      .get('/api/v1/incidents')
      .query({ page: 2, limit: 1 })
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.pagination.hasPrev).toBe(true);
  });

  test('401 — TOKEN_REQUIRED without token', async () => {
    const res = await request(app).get('/api/v1/incidents');

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('TOKEN_REQUIRED');
  });
});

describe('GET /api/v1/incidents/:id', () => {
  test('200 — returns incident, attachments, conversationCount, timeline', async () => {
    const { token } = await createStudent(app);
    const incident = await createIncident(app, token);

    const res = await request(app)
      .get(`/api/v1/incidents/${incident.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.attachments)).toBe(true);
    expect(typeof res.body.conversationCount).toBe('number');
    expect(Array.isArray(res.body.timeline)).toBe(true);
  });

  test('200 — timeline has an initial open status entry', async () => {
    const { token } = await createStudent(app);
    const incident = await createIncident(app, token);

    const res = await request(app)
      .get(`/api/v1/incidents/${incident.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.timeline.length).toBeGreaterThan(0);
    expect(res.body.timeline[0].status).toBe('open');
  });

  test('403 — student cannot see another student incident', async () => {
    const { token: ownerToken } = await createStudent(app);
    const incident = await createIncident(app, ownerToken);
    const { token: otherToken } = await createStudent(app);

    const res = await request(app)
      .get(`/api/v1/incidents/${incident.id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('INSUFFICIENT_PERMISSION');
  });

  test('404 — INCIDENT_NOT_FOUND for unknown id', async () => {
    const { token } = await createStudent(app);

    const res = await request(app).get('/api/v1/incidents/999999').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.errorCode).toBe('INCIDENT_NOT_FOUND');
  });

  test('401 — TOKEN_REQUIRED without token', async () => {
    const res = await request(app).get('/api/v1/incidents/1');

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('TOKEN_REQUIRED');
  });
});

describe('PATCH /api/v1/incidents/:id', () => {
  test('200 — student can update own open incident', async () => {
    const { token } = await createStudent(app);
    const incident = await createIncident(app, token);

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Titulo actualizado de la incidencia' });

    expect(res.status).toBe(200);
    expect(res.body.incident.title).toBe('Titulo actualizado de la incidencia');
  });

  test('400 — BUSINESS_RULE_VIOLATION when status is not open', async () => {
    const { token } = await createStudent(app);
    const incident = await createIncident(app, token);
    await request(app)
      .patch(`/api/v1/incidents/${incident.id}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Titulo actualizado de la incidencia' });

    expect(res.status).toBe(400);
    expect(res.body.errorCode).toBe('BUSINESS_RULE_VIOLATION');
  });

  test('403 — student cannot update another student incident', async () => {
    const { token: ownerToken } = await createStudent(app);
    const incident = await createIncident(app, ownerToken);
    const { token: otherToken } = await createStudent(app);

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Titulo actualizado de la incidencia' });

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('INSUFFICIENT_PERMISSION');
  });

  test('403 — INSUFFICIENT_ROLE for manager', async () => {
    const { token: studentToken } = await createStudent(app);
    const incident = await createIncident(app, studentToken);
    const { token: managerToken } = await createManager(db);

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ title: 'Titulo actualizado de la incidencia' });

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('INSUFFICIENT_ROLE');
  });

  test('404 — INCIDENT_NOT_FOUND for unknown id', async () => {
    const { token } = await createStudent(app);

    const res = await request(app)
      .patch('/api/v1/incidents/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Titulo actualizado de la incidencia' });

    expect(res.status).toBe(404);
    expect(res.body.errorCode).toBe('INCIDENT_NOT_FOUND');
  });
});

describe('PATCH /api/v1/incidents/:id/cancel', () => {
  test('200 — status changes to cancelled (not rejected)', async () => {
    const { token } = await createStudent(app);
    const incident = await createIncident(app, token);

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.incident.status).toBe('cancelled');
  });

  test('400 — BUSINESS_RULE_VIOLATION when status is not open', async () => {
    const { token } = await createStudent(app);
    const incident = await createIncident(app, token);
    await request(app)
      .patch(`/api/v1/incidents/${incident.id}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.errorCode).toBe('BUSINESS_RULE_VIOLATION');
  });

  test('403 — student cannot cancel another student incident', async () => {
    const { token: ownerToken } = await createStudent(app);
    const incident = await createIncident(app, ownerToken);
    const { token: otherToken } = await createStudent(app);

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}/cancel`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('INSUFFICIENT_PERMISSION');
  });

  test('404 — INCIDENT_NOT_FOUND for unknown id', async () => {
    const { token } = await createStudent(app);

    const res = await request(app)
      .patch('/api/v1/incidents/999999/cancel')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.errorCode).toBe('INCIDENT_NOT_FOUND');
  });
});

describe('PATCH /api/v1/incidents/:id/status', () => {
  test('200 — manager changes open → in_progress', async () => {
    const { token: studentToken } = await createStudent(app);
    const incident = await createIncident(app, studentToken);
    const { token: managerToken } = await createManager(db);

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}/status`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'in_progress', note: 'Se inicia la revision del caso.' });

    expect(res.status).toBe(200);
    expect(res.body.incident.status).toBe('in_progress');
  });

  test('200 — manager changes in_progress → resolved', async () => {
    const { token: studentToken } = await createStudent(app);
    const incident = await createIncident(app, studentToken);
    const { token: managerToken } = await createManager(db);
    await request(app)
      .patch(`/api/v1/incidents/${incident.id}/status`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'in_progress', note: 'Se inicia la revision del caso.' });

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}/status`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'resolved', note: 'El caso ha sido resuelto satisfactoriamente.' });

    expect(res.status).toBe(200);
    expect(res.body.incident.status).toBe('resolved');
  });

  test('200 — manager changes in_progress → rejected', async () => {
    const { token: studentToken } = await createStudent(app);
    const incident = await createIncident(app, studentToken);
    const { token: managerToken } = await createManager(db);
    await request(app)
      .patch(`/api/v1/incidents/${incident.id}/status`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'in_progress', note: 'Se inicia la revision del caso.' });

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}/status`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'rejected', note: 'El caso no procede segun las politicas institucionales.' });

    expect(res.status).toBe(200);
    expect(res.body.incident.status).toBe('rejected');
  });

  // 'open' is not an accepted target on this route's schema, so the terminal-state
  // rule is exercised instead with an enum-valid target (in_progress).
  test('400 — INVALID_TRANSITION on resolved → in_progress', async () => {
    const { token: studentToken } = await createStudent(app);
    const incident = await createIncident(app, studentToken);
    const { token: managerToken } = await createManager(db);
    await request(app)
      .patch(`/api/v1/incidents/${incident.id}/status`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'in_progress', note: 'Se inicia la revision del caso.' });
    await request(app)
      .patch(`/api/v1/incidents/${incident.id}/status`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'resolved', note: 'El caso ha sido resuelto satisfactoriamente.' });

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}/status`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'in_progress', note: 'Intento de reabrir el caso resuelto.' });

    expect(res.status).toBe(400);
    expect(res.body.errorCode).toBe('INVALID_TRANSITION');
  });

  test('400 — INVALID_TRANSITION on cancelled → in_progress', async () => {
    const { token: studentToken } = await createStudent(app);
    const incident = await createIncident(app, studentToken);
    await request(app)
      .patch(`/api/v1/incidents/${incident.id}/cancel`)
      .set('Authorization', `Bearer ${studentToken}`);
    const { token: managerToken } = await createManager(db);

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}/status`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'in_progress', note: 'Intento de reactivar el caso cancelado.' });

    expect(res.status).toBe(400);
    expect(res.body.errorCode).toBe('INVALID_TRANSITION');
  });

  test('403 — INSUFFICIENT_ROLE for student', async () => {
    const { token: studentToken } = await createStudent(app);
    const incident = await createIncident(app, studentToken);

    const res = await request(app)
      .patch(`/api/v1/incidents/${incident.id}/status`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ status: 'in_progress', note: 'Intento no autorizado.' });

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('INSUFFICIENT_ROLE');
  });

  test('404 — INCIDENT_NOT_FOUND for unknown id', async () => {
    const { token: managerToken } = await createManager(db);

    const res = await request(app)
      .patch('/api/v1/incidents/999999/status')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'in_progress', note: 'Caso inexistente.' });

    expect(res.status).toBe(404);
    expect(res.body.errorCode).toBe('INCIDENT_NOT_FOUND');
  });
});

describe('GET /api/v1/incidents/:id/similar', () => {
  test('200 — returns public incident info', async () => {
    const { token } = await createStudent(app);
    const incident = await createIncident(app, token);

    const res = await request(app)
      .get(`/api/v1/incidents/${incident.id}/similar`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.incident).toMatchObject({ id: incident.id, title: incident.title, status: 'open' });
  });

  test('403 — student cannot see another student similar incident', async () => {
    const { token: ownerToken } = await createStudent(app);
    const incident = await createIncident(app, ownerToken);
    const { token: otherToken } = await createStudent(app);

    const res = await request(app)
      .get(`/api/v1/incidents/${incident.id}/similar`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('INSUFFICIENT_PERMISSION');
  });

  test('404 — INCIDENT_NOT_FOUND for unknown id', async () => {
    const { token } = await createStudent(app);

    const res = await request(app)
      .get('/api/v1/incidents/999999/similar')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.errorCode).toBe('INCIDENT_NOT_FOUND');
  });
});
