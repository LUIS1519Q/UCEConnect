const logger = require('../../infrastructure/logger/logger');

class VerifyCode {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async execute({ email, code }) {
    logger.info(`Verification attempt: ${email}`);

    const verifyCode = await this.userRepo.findVerifyCode(email);
    if (!verifyCode) {
      logger.warn(`Verification failed — code not found: ${email}`);
      throw new Error('Verification code not found.');
    }

    if (verifyCode.used) {
      logger.warn(`Verification failed — code already used: ${email}`);
      throw new Error('Verification code has already been used.');
    }

    if (new Date(verifyCode.expiresAt) < new Date()) {
      logger.warn(`Verification failed — code expired: ${email}`);
      throw new Error('Verification code has expired.');
    }

    if (verifyCode.code !== code) {
      logger.warn(`Verification failed — code incorrect: ${email}`);
      throw new Error('Invalid verification code.');
    }

    const user = await this.userRepo.findByEmail(email);
    await this.userRepo.updateVerified(user.id);
    await this.userRepo.markCodeAsUsed(email);

    logger.info(`Account verified successfully: ${email}`);

    return { message: 'Account verified successfully' };
  }
}

module.exports = VerifyCode;
