const request = require('supertest');
const { app } = require('../../src/infrastructure/http/server');
const db = require('../../src/infrastructure/db/connection');
const { createStudent, createIncident } = require('./helpers');

require('./setup');

describe('GET /api/v1/notifications', () => {
  test('200 — returns empty list when no notifications', async () => {
    const { token } = await createStudent(app);

    const res = await request(app).get('/api/v1/notifications').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  test('200 — returns notifications after incident created', async () => {
    const { token } = await createStudent(app);
    await createIncident(app, token);

    const res = await request(app).get('/api/v1/notifications').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.some((n) => n.type === 'incident_created')).toBe(true);
  });

  test('200 — filters unread=true correctly', async () => {
    const { token } = await createStudent(app);
    await createIncident(app, token);
    const listRes = await request(app).get('/api/v1/notifications').set('Authorization', `Bearer ${token}`);
    const notificationId = listRes.body.data[0].id;

    await request(app)
      .patch(`/api/v1/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .get('/api/v1/notifications')
      .query({ unread: 'true' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.some((n) => n.id === notificationId)).toBe(false);
  });

  test('200 — pagination works correctly', async () => {
    const { token } = await createStudent(app);
    await createIncident(app, token);

    const res = await request(app)
      .get('/api/v1/notifications')
      .query({ page: 1, limit: 5 })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 5, total: expect.any(Number) });
  });

  test('401 — TOKEN_REQUIRED without token', async () => {
    const res = await request(app).get('/api/v1/notifications');

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('TOKEN_REQUIRED');
  });
});

describe('PATCH /api/v1/notifications/:id/read', () => {
  test('200 — marks notification as read', async () => {
    const { token } = await createStudent(app);
    await createIncident(app, token);
    const listRes = await request(app).get('/api/v1/notifications').set('Authorization', `Bearer ${token}`);
    const notificationId = listRes.body.data[0].id;

    const res = await request(app)
      .patch(`/api/v1/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    const notifRow = await db.query('SELECT is_read FROM notifications WHERE id = $1', [notificationId]);
    expect(notifRow.rows[0].is_read).toBe(true);
  });

  test('404 — NOTIFICATION_NOT_FOUND for unknown id', async () => {
    const { token } = await createStudent(app);

    const res = await request(app)
      .patch('/api/v1/notifications/999999/read')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.errorCode).toBe('NOTIFICATION_NOT_FOUND');
  });

  test("403 — INSUFFICIENT_PERMISSION for other user's notification", async () => {
    const { token: ownerToken } = await createStudent(app);
    await createIncident(app, ownerToken);
    const listRes = await request(app).get('/api/v1/notifications').set('Authorization', `Bearer ${ownerToken}`);
    const notificationId = listRes.body.data[0].id;
    const { token: otherToken } = await createStudent(app);

    const res = await request(app)
      .patch(`/api/v1/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('INSUFFICIENT_PERMISSION');
  });

  test('401 — TOKEN_REQUIRED without token', async () => {
    const res = await request(app).patch('/api/v1/notifications/1/read');

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('TOKEN_REQUIRED');
  });
});
