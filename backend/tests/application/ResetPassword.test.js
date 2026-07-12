jest.mock('../../src/infrastructure/logger/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const ResetPassword = require('../../src/application/users/ResetPassword');

const buildUser = (overrides = {}) => ({
  id: 1,
  email: 'ana.perez@uce.edu.ec',
  passwordHash: 'current-hash',
  ...overrides,
});

const signResetToken = (payload = {}) =>
  jwt.sign(
    { email: 'ana.perez@uce.edu.ec', purpose: 'reset_password', ...payload },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

describe('ResetPassword', () => {
  let userRepo;
  let bcrypt;
  let resetPassword;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepo = {
      findByEmail: jest.fn(),
      updatePassword: jest.fn().mockResolvedValue(undefined),
    };
    bcrypt = {
      compare: jest.fn().mockResolvedValue(false),
      hash: jest.fn().mockResolvedValue('new-hash'),
    };
    resetPassword = new ResetPassword(userRepo, bcrypt);
  });

  test('throws INVALID_RESET_TOKEN when JWT is invalid', async () => {
    await expect(
      resetPassword.execute({ resetToken: 'not-a-real-jwt', newPassword: 'NewPassword1!' })
    ).rejects.toThrow('Invalid or expired reset token.');
  });

  test('throws INVALID_RESET_TOKEN when purpose is not reset_password', async () => {
    const resetToken = signResetToken({ purpose: 'other_purpose' });

    await expect(
      resetPassword.execute({ resetToken, newPassword: 'NewPassword1!' })
    ).rejects.toThrow('Invalid reset token.');
  });

  test('throws USER_NOT_FOUND when user does not exist', async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    const resetToken = signResetToken();

    await expect(
      resetPassword.execute({ resetToken, newPassword: 'NewPassword1!' })
    ).rejects.toThrow('User not found.');
  });

  test('throws SAME_PASSWORD when new password equals current', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser());
    bcrypt.compare.mockResolvedValue(true);
    const resetToken = signResetToken();

    await expect(
      resetPassword.execute({ resetToken, newPassword: 'SamePassword1!' })
    ).rejects.toThrow('New password must be different from the current password.');
  });

  test('calls bcrypt.hash with newPassword and 10 rounds', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser());
    const resetToken = signResetToken();

    await resetPassword.execute({ resetToken, newPassword: 'NewPassword1!' });

    expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword1!', 10);
  });

  test('calls updatePassword with userId and new hash', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser());
    const resetToken = signResetToken();

    await resetPassword.execute({ resetToken, newPassword: 'NewPassword1!' });

    expect(userRepo.updatePassword).toHaveBeenCalledWith(1, 'new-hash');
  });

  test('returns success message', async () => {
    userRepo.findByEmail.mockResolvedValue(buildUser());
    const resetToken = signResetToken();

    const result = await resetPassword.execute({ resetToken, newPassword: 'NewPassword1!' });

    expect(result).toEqual({ message: 'Password updated successfully' });
  });
});
