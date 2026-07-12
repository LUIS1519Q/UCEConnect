const logger = require('../../infrastructure/logger/logger');

class ForgotPassword {
  constructor(userRepo, emailNotifier) {
    this.userRepo = userRepo;
    this.emailNotifier = emailNotifier;
  }

  async execute({ email }) {
    logger.info(`Password recovery requested: ${email}`);

    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        logger.warn(`Recovery failed — user not found: ${email}`);
        throw new Error('User not found.');
      }

      if (user.isActive === false) {
        logger.warn(`Recovery failed — account disabled: ${email}`);
        throw new Error('Your account has been deactivated.');
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await this.userRepo.deleteResetCodesByUserId(user.id);
      await this.userRepo.saveResetCode(user.id, code, expiresAt);

      await this.emailNotifier.sendPasswordResetCode(email, code);

      logger.info(`Recovery code sent to: ${email}`);

      return { message: 'Code sent. Check your email.' };
    } catch (error) {
      logger.error(`Error in password recovery: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ForgotPassword;
