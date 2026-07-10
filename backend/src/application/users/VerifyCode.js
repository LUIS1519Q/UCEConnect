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
      throw new Error('Verification code not found.');
    }

    if (verifyCode.used) {
      logger.warn(`Verificación fallida — código no encontrado: ${email}`);
      throw new Error('Verification code has already been used.');
    }

    if (new Date(verifyCode.expiresAt) < new Date()) {
      logger.warn(`Verificación fallida — código expirado: ${email}`);
      throw new Error('Verification code has expired.');
    }

    if (verifyCode.code !== code) {
      logger.warn(`Verificación fallida — código incorrecto: ${email}`);
      throw new Error('Invalid verification code.');
    }

    const user = await this.userRepo.findByEmail(email);
    await this.userRepo.updateVerified(user.id);
    await this.userRepo.markCodeAsUsed(email);

    logger.info(`Cuenta verificada exitosamente: ${email}`);

    return { message: 'Cuenta verificada exitosamente' };
  }
}

module.exports = VerifyCode;
