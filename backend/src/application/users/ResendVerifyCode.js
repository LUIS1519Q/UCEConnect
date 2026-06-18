const logger = require('../../infrastructure/logger/logger');

class ResendVerifyCode {
  constructor(userRepo, emailNotifier) {
    this.userRepo = userRepo;
    this.emailNotifier = emailNotifier;
  }

  async execute({ email, code: unusedCode }) {
    logger.info(`Intento de reenvío de código: ${email}`);

    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        logger.warn(`Reenvío fallido — usuario no encontrado: ${email}`);
        throw new Error('Correo no encontrado');
      }

      if (user.isVerified) {
        logger.warn(`Reenvío fallido — usuario ya verificado: ${email}`);
        throw new Error('Esta cuenta ya está verificada');
      }

      await this.userRepo.deleteVerifyCodesByUserId(user.id);

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await this.userRepo.saveVerifyCode(user.id, code, expiresAt);

      logger.info(`Enviando código de verificación a: ${email}`);
      await this.emailNotifier.sendVerificationCode(email, code);

      logger.info(`Código de verificación reenviado exitosamente: ${email}`);

      return { message: 'Código de verificación reenviado exitosamente' };
    } catch (error) {
      logger.error(`Error en reenvío de código: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ResendVerifyCode;
