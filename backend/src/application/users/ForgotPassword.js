const logger = require('../../infrastructure/logger/logger');

class ForgotPassword {
  constructor(userRepo, emailNotifier) {
    this.userRepo = userRepo;
    this.emailNotifier = emailNotifier;
  }

  async execute({ email }) {
    logger.info(`Solicitud de recuperación de contraseña: ${email}`);

    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        logger.warn(`Recuperación fallida — usuario no encontrado: ${email}`);
        throw new Error('Correo no encontrado');
      }

      if (user.isActive === false) {
        logger.warn(`Recuperación fallida — cuenta desactivada: ${email}`);
        throw new Error('Tu cuenta ha sido desactivada');
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await this.userRepo.deleteResetCodesByUserId(user.id);
      await this.userRepo.saveResetCode(user.id, code, expiresAt);

      await this.emailNotifier.sendPasswordResetCode(email, code);

      logger.info(`Código de recuperación enviado a: ${email}`);

      return { message: 'Código enviado. Revisa tu correo.' };
    } catch (error) {
      logger.error(`Error en recuperación de contraseña: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ForgotPassword;
