const logger = require('../../infrastructure/logger/logger');

class ResendResetCode {
  constructor(userRepo, emailNotifier) {
    this.userRepo = userRepo;
    this.emailNotifier = emailNotifier;
  }

  async execute({ email }) {
    logger.info(`Resend reset code attempt: ${email}`);

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      logger.warn(`Resend reset code failed — user not found: ${email}`);
      throw new Error('User not found.');
    }

    if (user.isActive === false) {
      logger.warn(`Resend reset code failed — account disabled: ${email}`);
      throw new Error('Your account has been deactivated.');
    }

    const code = require('crypto').randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.userRepo.saveResetCode(user.id, code, expiresAt);
    await this.emailNotifier.sendPasswordResetCode(email, code);

    logger.info(`Reset code resent to: ${email}`);

    return { message: 'Code resent successfully' };
  }
}

module.exports = ResendResetCode;
