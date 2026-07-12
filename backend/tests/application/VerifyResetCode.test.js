jest.mock('../../src/infrastructure/logger/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const VerifyResetCode = require('../../src/application/users/VerifyResetCode');

const buildResetCode = (overrides = {}) => ({
  code: '123456',
  used: false,
  expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  ...overrides,
});

describe('VerifyResetCode', () => {
  let userRepo;
  let verifyResetCode;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepo = {
      findResetCode: jest.fn(),
      markResetCodeAsUsed: jest.fn().mockResolvedValue(undefined),
    };
    verifyResetCode = new VerifyResetCode(userRepo);
  });

  test('throws CODE_NOT_FOUND when code does not exist', async () => {
    userRepo.findResetCode.mockResolvedValue(null);

    await expect(
      verifyResetCode.execute({ email: 'ana.perez@uce.edu.ec', code: '123456' })
    ).rejects.toThrow('Recovery code not found.');
  });

  test('throws CODE_ALREADY_USED when code is used', async () => {
    userRepo.findResetCode.mockResolvedValue(buildResetCode({ used: true }));

    await expect(
      verifyResetCode.execute({ email: 'ana.perez@uce.edu.ec', code: '123456' })
    ).rejects.toThrow('Verification code has already been used.');
  });

  test('throws CODE_EXPIRED when code is expired', async () => {
    userRepo.findResetCode.mockResolvedValue(
      buildResetCode({ expiresAt: new Date(Date.now() - 60 * 1000) })
    );

    await expect(
      verifyResetCode.execute({ email: 'ana.perez@uce.edu.ec', code: '123456' })
    ).rejects.toThrow('Verification code has expired.');
  });

  test('throws INVALID_CODE when code does not match', async () => {
    userRepo.findResetCode.mockResolvedValue(buildResetCode({ code: '654321' }));

    await expect(
      verifyResetCode.execute({ email: 'ana.perez@uce.edu.ec', code: '123456' })
    ).rejects.toThrow('Invalid verification code.');
  });

  test('returns resetToken JWT on success', async () => {
    userRepo.findResetCode.mockResolvedValue(buildResetCode());

    const result = await verifyResetCode.execute({ email: 'ana.perez@uce.edu.ec', code: '123456' });

    expect(result.resetToken).toBeDefined();
  });

  test('resetToken has purpose: reset_password in payload', async () => {
    userRepo.findResetCode.mockResolvedValue(buildResetCode());

    const result = await verifyResetCode.execute({ email: 'ana.perez@uce.edu.ec', code: '123456' });
    const decoded = jwt.verify(result.resetToken, process.env.JWT_SECRET);

    expect(decoded.purpose).toBe('reset_password');
    expect(decoded.email).toBe('ana.perez@uce.edu.ec');
  });

  test('calls markResetCodeAsUsed after validation', async () => {
    userRepo.findResetCode.mockResolvedValue(buildResetCode());

    await verifyResetCode.execute({ email: 'ana.perez@uce.edu.ec', code: '123456' });

    expect(userRepo.markResetCodeAsUsed).toHaveBeenCalledWith('ana.perez@uce.edu.ec');
  });
});
