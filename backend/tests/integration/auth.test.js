const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../../src/infrastructure/http/server');
const db = require('../../src/infrastructure/db/connection');
const { createStudent, DEFAULT_PASSWORD } = require('./helpers');

require('./setup');

describe('POST /api/v1/auth/register', () => {
  test('201 — creates user with firstName and lastName', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Maria',
      lastName: 'Lopez',
      email: `maria.${Date.now()}@uce.edu.ec`,
      password: DEFAULT_PASSWORD,
      confirmPassword: DEFAULT_PASSWORD,
    });

    expect(res.status).toBe(201);
    expect(res.body.user.firstName).toBe('Maria');
    expect(res.body.user.lastName).toBe('Lopez');
  });

  test('400 — EMAIL_ALREADY_REGISTERED on duplicate email', async () => {
    const email = `duplicado.${Date.now()}@uce.edu.ec`;
    const payload = {
      firstName: 'Carlos',
      lastName: 'Ramirez',
      email,
      password: DEFAULT_PASSWORD,
      confirmPassword: DEFAULT_PASSWORD,
    };

    await request(app).post('/api/v1/auth/register').send(payload);
    const res = await request(app).post('/api/v1/auth/register').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.errorCode).toBe('EMAIL_ALREADY_REGISTERED');
  });

  test('400 — validation error without firstName', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      lastName: 'Ramirez',
      email: `sinnombre.${Date.now()}@uce.edu.ec`,
      password: DEFAULT_PASSWORD,
      confirmPassword: DEFAULT_PASSWORD,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation error');
    expect(res.body.errors).toHaveProperty('firstName');
  });

  test('400 — validation error with non-institutional email', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Carlos',
      lastName: 'Ramirez',
      email: `carlos.${Date.now()}@gmail.com`,
      password: DEFAULT_PASSWORD,
      confirmPassword: DEFAULT_PASSWORD,
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('email');
  });

  test('400 — validation error when passwords do not match', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Carlos',
      lastName: 'Ramirez',
      email: `nomatch.${Date.now()}@uce.edu.ec`,
      password: DEFAULT_PASSWORD,
      confirmPassword: 'OtraPassword1!',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('confirmPassword');
  });

  test('400 — validation error with weak password', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Carlos',
      lastName: 'Ramirez',
      email: `debil.${Date.now()}@uce.edu.ec`,
      password: 'abcdefg',
      confirmPassword: 'abcdefg',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('password');
  });
});

describe('POST /api/v1/auth/login', () => {
  test('200 — returns accessToken and refreshToken', async () => {
    const { user } = await createStudent(app);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: DEFAULT_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  test('200 — returned user has firstName, lastName, role', async () => {
    const { user } = await createStudent(app);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: DEFAULT_PASSWORD });

    expect(res.body.user).toMatchObject({
      firstName: user.firstName,
      lastName: user.lastName,
      role: 'student',
    });
  });

  test('401 — INVALID_CREDENTIALS with wrong password', async () => {
    const { user } = await createStudent(app);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: 'WrongPassword1!' });

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('INVALID_CREDENTIALS');
  });

  test('403 — EMAIL_NOT_VERIFIED for unverified account', async () => {
    const email = `noverificado.${Date.now()}@uce.edu.ec`;
    await request(app).post('/api/v1/auth/register').send({
      firstName: 'Ana',
      lastName: 'Torres',
      email,
      password: DEFAULT_PASSWORD,
      confirmPassword: DEFAULT_PASSWORD,
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: DEFAULT_PASSWORD });

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('EMAIL_NOT_VERIFIED');
  });

  test('403 — USER_DISABLED for deactivated account', async () => {
    const { user } = await createStudent(app);
    await db.query('UPDATE users SET is_active = false WHERE email = $1', [user.email]);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: DEFAULT_PASSWORD });

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('USER_DISABLED');
  });
});

describe('GET /api/v1/auth/me', () => {
  test('200 — returns user profile with faculty and career', async () => {
    const { user, token } = await createStudent(app);
    const facultyRow = await db.query('SELECT id FROM faculties ORDER BY id ASC LIMIT 1');
    const facultyId = facultyRow.rows[0].id;
    const careerRow = await db.query('SELECT id FROM careers WHERE faculty_id = $1 LIMIT 1', [facultyId]);
    const careerId = careerRow.rows[0].id;

    await request(app)
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ facultyId, careerId });

    const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.user.faculty).toBeTruthy();
    expect(res.body.user.career).toBeTruthy();
  });

  test('401 — TOKEN_REQUIRED without token', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('TOKEN_REQUIRED');
  });

  test('401 — TOKEN_INVALID with expired token', async () => {
    const expiredToken = jwt.sign({ id: 1, email: 'x@uce.edu.ec', role: 'student' }, process.env.JWT_SECRET, {
      expiresIn: '-10s',
    });

    const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('TOKEN_INVALID');
  });
});

describe('PATCH /api/v1/auth/me', () => {
  test('200 — updates firstName, lastName, phone', async () => {
    const { token } = await createStudent(app);

    const res = await request(app)
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Actualizado', lastName: 'Apellido', phone: '+593987654321' });

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      firstName: 'Actualizado',
      lastName: 'Apellido',
      phone: '+593987654321',
    });
  });

  test('200 — updates facultyId and careerId', async () => {
    const { token } = await createStudent(app);
    const facultyRow = await db.query('SELECT id FROM faculties ORDER BY id ASC LIMIT 1');
    const facultyId = facultyRow.rows[0].id;
    const careerRow = await db.query('SELECT id FROM careers WHERE faculty_id = $1 LIMIT 1', [facultyId]);
    const careerId = careerRow.rows[0].id;

    const res = await request(app)
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ facultyId, careerId });

    expect(res.status).toBe(200);
    expect(res.body.user.facultyId).toBe(facultyId);
    expect(res.body.user.careerId).toBe(careerId);
  });

  test('400 — validation error with invalid phone format', async () => {
    const { token } = await createStudent(app);

    const res = await request(app)
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: 'abc' });

    expect(res.status).toBe(400);
  });

  test('401 — TOKEN_REQUIRED without token', async () => {
    const res = await request(app).patch('/api/v1/auth/me').send({ firstName: 'X' });

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('TOKEN_REQUIRED');
  });
});

describe('POST /api/v1/auth/forgot-password', () => {
  test('200 — sends reset code for existing user', async () => {
    const { user } = await createStudent(app);

    const res = await request(app).post('/api/v1/auth/forgot-password').send({ email: user.email });

    expect(res.status).toBe(200);
  });

  test('404 — USER_NOT_FOUND for unknown email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: `inexistente.${Date.now()}@uce.edu.ec` });

    expect(res.status).toBe(404);
    expect(res.body.errorCode).toBe('USER_NOT_FOUND');
  });
});

describe('POST /api/v1/auth/verify-reset-code', () => {
  test('200 — returns resetToken for valid code', async () => {
    const { user } = await createStudent(app);
    await request(app).post('/api/v1/auth/forgot-password').send({ email: user.email });

    const codeRow = await db.query(
      `SELECT prc.code FROM password_reset_codes prc
       JOIN users u ON prc.user_id = u.id
       WHERE u.email = $1 ORDER BY prc.created_at DESC LIMIT 1`,
      [user.email]
    );
    const code = codeRow.rows[0].code;

    const res = await request(app)
      .post('/api/v1/auth/verify-reset-code')
      .send({ email: user.email, code });

    expect(res.status).toBe(200);
    expect(res.body.resetToken).toBeDefined();
  });

  test('404 — CODE_NOT_FOUND for unknown code', async () => {
    const { user } = await createStudent(app);

    const res = await request(app)
      .post('/api/v1/auth/verify-reset-code')
      .send({ email: user.email, code: '000000' });

    expect(res.status).toBe(404);
    expect(res.body.errorCode).toBe('CODE_NOT_FOUND');
  });

  test('400 — CODE_EXPIRED for expired code', async () => {
    const { user } = await createStudent(app);
    const userRow = await db.query('SELECT id FROM users WHERE email = $1', [user.email]);
    const userId = userRow.rows[0].id;
    const expiredDate = new Date(Date.now() - 60 * 1000);

    await db.query(
      'INSERT INTO password_reset_codes (user_id, code, expires_at) VALUES ($1, $2, $3)',
      [userId, '123456', expiredDate]
    );

    const res = await request(app)
      .post('/api/v1/auth/verify-reset-code')
      .send({ email: user.email, code: '123456' });

    expect(res.status).toBe(400);
    expect(res.body.errorCode).toBe('CODE_EXPIRED');
  });
});

describe('POST /api/v1/auth/reset-password', () => {
  async function requestResetToken(email) {
    await request(app).post('/api/v1/auth/forgot-password').send({ email });
    const codeRow = await db.query(
      `SELECT prc.code FROM password_reset_codes prc
       JOIN users u ON prc.user_id = u.id
       WHERE u.email = $1 ORDER BY prc.created_at DESC LIMIT 1`,
      [email]
    );
    const verifyRes = await request(app)
      .post('/api/v1/auth/verify-reset-code')
      .send({ email, code: codeRow.rows[0].code });
    return verifyRes.body.resetToken;
  }

  test('200 — updates password with valid resetToken', async () => {
    const { user } = await createStudent(app);
    const resetToken = await requestResetToken(user.email);

    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ resetToken, newPassword: 'NuevaPassword1!' });

    expect(res.status).toBe(200);

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: 'NuevaPassword1!' });
    expect(loginRes.status).toBe(200);
  });

  test('401 — INVALID_RESET_TOKEN for invalid JWT', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ resetToken: 'not-a-real-jwt', newPassword: 'NuevaPassword1!' });

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('INVALID_RESET_TOKEN');
  });

  test('400 — SAME_PASSWORD when new equals current', async () => {
    const { user } = await createStudent(app);
    const resetToken = await requestResetToken(user.email);

    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ resetToken, newPassword: DEFAULT_PASSWORD });

    expect(res.status).toBe(400);
    expect(res.body.errorCode).toBe('SAME_PASSWORD');
  });
});
