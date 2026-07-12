const logger = require('../../infrastructure/logger/logger');

class ResendVerifyCode {
  constructor(userRepo, emailNotifier) {
    this.userRepo = userRepo;
    this.emailNotifier = emailNotifier;
  }

  async execute({ email, code: unusedCode }) {
    logger.info(`Resend code attempt: ${email}`);

    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        logger.warn(`Resend failed — user not found: ${email}`);
        throw new Error('User not found.');
      }

      if (user.isVerified) {
        logger.warn(`Resend failed — user already verified: ${email}`);
        throw new Error('This account is already verified.');
      }

      await this.userRepo.deleteVerifyCodesByUserId(user.id);

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await this.userRepo.saveVerifyCode(user.id, code, expiresAt);

      logger.info(`Sending verification code to: ${email}`);
      await this.emailNotifier.sendVerificationCode(email, code);

      logger.info(`Verification code resent successfully: ${email}`);

      return { message: 'Verification code resent successfully' };
    } catch (error) {
      logger.error(`Error resending code: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ResendVerifyCode;
