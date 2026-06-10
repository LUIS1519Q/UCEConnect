// VerifyCode.js — Caso de uso: verificar el código de confirmación de cuenta
// Orquesta el repositorio de usuarios (IUserRepo) para validar el código enviado
// por correo y activar la cuenta del usuario.

class VerifyCode {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async execute({ email, code }) {
    // 1-2. Debe existir un código de verificación pendiente para este correo
    const verifyCode = await this.userRepo.findVerifyCode(email);
    if (!verifyCode) {
      throw new Error('Código no encontrado');
    }

    // 3. Un código ya utilizado no puede reutilizarse
    if (verifyCode.used) {
      throw new Error('El código ya fue utilizado');
    }

    // 4. Un código tiene una validez de 5 minutos desde su creación
    if (new Date(verifyCode.expiresAt) < new Date()) {
      throw new Error('El código ha expirado');
    }

    // 5. El código debe coincidir exactamente con el enviado por correo
    if (verifyCode.code !== code) {
      throw new Error('Código incorrecto');
    }

    // 6-8. Activa la cuenta del usuario y consume el código
    const user = await this.userRepo.findByEmail(email);
    await this.userRepo.updateVerified(user.id);
    await this.userRepo.markCodeAsUsed(email);

    return { message: 'Cuenta verificada exitosamente' };
  }
}

module.exports = VerifyCode;
