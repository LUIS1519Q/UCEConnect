const logger = require('../../infrastructure/logger/logger');

class VerifyCode {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async execute({ email, code }) {
    logger.info(`Intento de verificación: ${email}`);

    const verifyCode = await this.userRepo.findVerifyCode(email);
    if (!verifyCode) {
      logger.warn(`Verificación fallida — código no encontrado: ${email}`);
      throw new Error('Código no encontrado');
    }

    if (verifyCode.used) {
      logger.warn(`Verificación fallida — código no encontrado: ${email}`);
      throw new Error('El código ya fue utilizado');
    }

    if (new Date(verifyCode.expiresAt) < new Date()) {
      logger.warn(`Verificación fallida — código expirado: ${email}`);
      throw new Error('El código ha expirado');
    }

    if (verifyCode.code !== code) {
      logger.warn(`Verificación fallida — código incorrecto: ${email}`);
      throw new Error('Código incorrecto');
    }

    const user = await this.userRepo.findByEmail(email);
    await this.userRepo.updateVerified(user.id);
    await this.userRepo.markCodeAsUsed(email);

    logger.info(`Cuenta verificada exitosamente: ${email}`);

    return { message: 'Cuenta verificada exitosamente' };
  }
}

module.exports = VerifyCode;
