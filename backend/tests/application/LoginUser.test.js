jest.mock('../../src/infrastructure/logger/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const LoginUser = require('../../src/application/users/LoginUser');

const JWT_SECRET = 'jwt-secret';
const JWT_REFRESH_SECRET = 'jwt-refresh-secret';

const buildUser = (overrides = {}) => ({
  id: 1,
  firstName: 'Ana',
  lastName: 'Perez',
  email: 'ana.perez@uce.edu.ec',
  passwordHash: 'hashed-password',
  roleId: 1,
  isActive: true,
  isVerified: true,
  ...overrides,
});

describe('LoginUser', () => {
  let userRepo;
  let bcrypt;
  let jwt;
  let loginUser;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepo = { findByEmail: jest.fn() };
    bcrypt = { compare: jest.fn() };
    jwt = { sign: jest.fn().mockReturnValue('fake-token') };
    loginUser = new LoginUser(userRepo, bcrypt, jwt, JWT_SECRET, JWT_REFRESH_SECRET);
  });

  test('throws when user is not found', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(loginUser.execute({ email: 'missing@uce.edu.ec', password: '123' })).rejects.toThrow(
      'Invalid credentials.'
    );
  });

  test('throws when account is not verified', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser({ isVerified: false }));

    await expect(loginUser.execute({ email: 'ana.perez@uce.edu.ec', password: '123' })).rejects.toThrow(
      'You must verify your email before logging in.'
    );
  });

  test('throws when account is not active', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser({ isActive: false }));

    await expect(loginUser.execute({ email: 'ana.perez@uce.edu.ec', password: '123' })).rejects.toThrow(
      'Your account has been deactivated.'
    );
  });

  test('throws when password does not match', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser());
    bcrypt.compare.mockResolvedValue(false);

    await expect(loginUser.execute({ email: 'ana.perez@uce.edu.ec', password: 'wrong' })).rejects.toThrow(
      'Invalid credentials.'
    );
  });

  test('returns accessToken and refreshToken on success', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser());
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

    const result = await loginUser.execute({ email: 'ana.perez@uce.edu.ec', password: '123' });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
  });

  test('returned user has firstName, lastName, email and role', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser());
    bcrypt.compare.mockResolvedValue(true);

    const result = await loginUser.execute({ email: 'ana.perez@uce.edu.ec', password: '123' });

    expect(result.user).toMatchObject({
      firstName: 'Ana',
      lastName: 'Perez',
      email: 'ana.perez@uce.edu.ec',
      role: 'student',
    });
  });

  test('returned user does NOT have passwordHash', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser());
    bcrypt.compare.mockResolvedValue(true);

    const result = await loginUser.execute({ email: 'ana.perez@uce.edu.ec', password: '123' });

    expect(result.user).not.toHaveProperty('passwordHash');
  });
});
