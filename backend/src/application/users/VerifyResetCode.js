const jwt = require('jsonwebtoken');
const logger = require('../../infrastructure/logger/logger');

class VerifyResetCode {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async execute({ email, code }) {
    logger.info(`Intento de verificación de código de reset: ${email}`);

    const resetCode = await this.userRepo.findResetCode(email);
    if (!resetCode) {
      logger.warn(`Verificación de código de reset fallida — código no encontrado: ${email}`);
      throw new Error('Código no encontrado');
    }

    if (resetCode.used) {
      logger.warn(`Verificación de código de reset fallida — código ya utilizado: ${email}`);
      throw new Error('El código ya fue utilizado');
    }

    if (new Date() > new Date(resetCode.expiresAt)) {
      logger.warn(`Verificación de código de reset fallida — código expirado: ${email}`);
      throw new Error('El código ha expirado');
    }

    if (resetCode.code !== code) {
      logger.warn(`Verificación de código de reset fallida — código incorrecto: ${email}`);
      throw new Error('Código incorrecto');
    }

    const resetToken = jwt.sign({ email, purpose: 'reset_password' }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    await this.userRepo.markResetCodeAsUsed(email);

    logger.info(`Verificación de código de reset exitosa para: ${email}`);

    return { resetToken };
  }
}

module.exports = VerifyResetCode;
