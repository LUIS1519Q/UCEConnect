const jwt = require('jsonwebtoken');
const logger = require('../../infrastructure/logger/logger');

class ResetPassword {
  constructor(userRepo, bcrypt) {
    this.userRepo = userRepo;
    this.bcrypt = bcrypt;
  }

  async execute({ resetToken, newPassword }) {
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      logger.warn(`Restablecimiento fallido — token inválido o expirado: ${error.message}`);
      throw new Error('Token inválido o expirado');
    }

    if (decoded.purpose !== 'reset_password') {
      logger.warn('Restablecimiento fallido — token con propósito inválido');
      throw new Error('Token inválido');
    }

    const { email } = decoded;
    logger.info(`Intento de restablecimiento de contraseña: ${email}`);

    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        logger.warn(`Restablecimiento fallido — usuario no encontrado: ${email}`);
        throw new Error('Usuario no encontrado');
      }

      const passwordHash = await this.bcrypt.hash(newPassword, 10);
      await this.userRepo.updatePassword(user.id, passwordHash);

      logger.info(`Contraseña actualizada para: ${email}`);

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      logger.error(`Error en restablecimiento de contraseña: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ResetPassword;
