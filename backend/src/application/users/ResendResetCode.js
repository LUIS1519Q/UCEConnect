const logger = require('../../infrastructure/logger/logger');

class ResendResetCode {
  constructor(userRepo, emailNotifier) {
    this.userRepo = userRepo;
    this.emailNotifier = emailNotifier;
  }

  async execute({ email }) {
    logger.info(`Intento de reenvío de código de reset: ${email}`);

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      logger.warn(`Reenvío de código de reset fallido — usuario no encontrado: ${email}`);
      throw new Error('User not found.');
    }

    if (user.isActive === false) {
      logger.warn(`Reenvío de código de reset fallido — cuenta desactivada: ${email}`);
      throw new Error('Your account has been deactivated.');
    }

    const code = require('crypto').randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.userRepo.saveResetCode(user.id, code, expiresAt);
    await this.emailNotifier.sendPasswordResetCode(email, code);

    logger.info(`Código de reset reenviado a: ${email}`);

    return { message: 'Código reenviado correctamente' };
  }
}

module.exports = ResendResetCode;
