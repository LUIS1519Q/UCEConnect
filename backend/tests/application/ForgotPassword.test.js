jest.mock('../../src/infrastructure/logger/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const ForgotPassword = require('../../src/application/users/ForgotPassword');

const buildUser = (overrides = {}) => ({
  id: 1,
  email: 'ana.perez@uce.edu.ec',
  isActive: true,
  ...overrides,
});

describe('ForgotPassword', () => {
  let userRepo;
  let emailNotifier;
  let forgotPassword;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepo = {
      findByEmail: jest.fn(),
      deleteResetCodesByUserId: jest.fn().mockResolvedValue(undefined),
      saveResetCode: jest.fn().mockResolvedValue(undefined),
    };
    emailNotifier = { sendPasswordResetCode: jest.fn().mockResolvedValue(undefined) };
    forgotPassword = new ForgotPassword(userRepo, emailNotifier);
  });

  test('throws USER_NOT_FOUND when email does not exist', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(forgotPassword.execute({ email: 'missing@uce.edu.ec' })).rejects.toThrow(
      'User not found.'
    );
  });

  test('throws USER_DISABLED when account is not active', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser({ isActive: false }));

    await expect(forgotPassword.execute({ email: 'ana.perez@uce.edu.ec' })).rejects.toThrow(
      'Your account has been deactivated.'
    );
  });

  test('calls saveResetCode with a 6-digit code', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser());

    await forgotPassword.execute({ email: 'ana.perez@uce.edu.ec' });

    expect(userRepo.saveResetCode).toHaveBeenCalledWith(
      1,
      expect.stringMatching(/^\d{6}$/),
      expect.any(Date)
    );
  });

  test('calls sendPasswordResetCode with the correct email', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser());

    await forgotPassword.execute({ email: 'ana.perez@uce.edu.ec' });

    expect(emailNotifier.sendPasswordResetCode).toHaveBeenCalledWith(
      'ana.perez@uce.edu.ec',
      expect.stringMatching(/^\d{6}$/)
    );
  });

  test('returns success message', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser());

    const result = await forgotPassword.execute({ email: 'ana.perez@uce.edu.ec' });

    expect(result).toEqual({ message: 'Código enviado. Revisa tu correo.' });
  });
});
