const jwt = require('jsonwebtoken');
const logger = require('../../infrastructure/logger/logger');

class VerifyResetCode {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async execute({ email, code }) {
    logger.info(`Reset code verification attempt: ${email}`);

    const resetCode = await this.userRepo.findResetCode(email);
    if (!resetCode) {
      logger.warn(`Reset code verification failed — code not found: ${email}`);
      throw new Error('Recovery code not found.');
    }

    if (resetCode.used) {
      logger.warn(`Reset code verification failed — code already used: ${email}`);
      throw new Error('Verification code has already been used.');
    }

    if (new Date() > new Date(resetCode.expiresAt)) {
      logger.warn(`Reset code verification failed — code expired: ${email}`);
      throw new Error('Verification code has expired.');
    }

    if (resetCode.code !== code) {
      logger.warn(`Reset code verification failed — code incorrect: ${email}`);
      throw new Error('Invalid verification code.');
    }

    const resetToken = jwt.sign({ email, purpose: 'reset_password' }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    await this.userRepo.markResetCodeAsUsed(email);

    logger.info(`Reset code verification succeeded for: ${email}`);

    return { message: 'Code verified successfully', resetToken };
  }
}

module.exports = VerifyResetCode;
