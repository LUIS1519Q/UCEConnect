const logger = require('../../infrastructure/logger/logger');

class ResetPassword {
  constructor(userRepo, bcrypt) {
    this.userRepo = userRepo;
    this.bcrypt = bcrypt;
  }

  async execute({ email, code, newPassword }) {
    logger.info(`Intento de restablecimiento de contraseña: ${email}`);

    try {
      const resetCode = await this.userRepo.findResetCode(email);
      if (!resetCode) {
        logger.warn(`Restablecimiento fallido — código no encontrado: ${email}`);
        throw new Error('Código no encontrado');
      }

      if (resetCode.used) {
        logger.warn(`Restablecimiento fallido — código ya utilizado: ${email}`);
        throw new Error('El código ya fue utilizado');
      }

      if (new Date() > new Date(resetCode.expiresAt)) {
        logger.warn(`Restablecimiento fallido — código expirado: ${email}`);
        throw new Error('El código ha expirado');
      }

      if (resetCode.code !== code) {
        logger.warn(`Restablecimiento fallido — código incorrecto: ${email}`);
        throw new Error('Código incorrecto');
      }

      const user = await this.userRepo.findByEmail(email);

      const passwordHash = await this.bcrypt.hash(newPassword, 10);
      await this.userRepo.updatePassword(user.id, passwordHash);
      await this.userRepo.markResetCodeAsUsed(email);

      logger.info(`Contraseña actualizada para: ${email}`);

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      logger.error(`Error en restablecimiento de contraseña: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ResetPassword;
