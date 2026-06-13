const User = require('../../domain/users/User');
const logger = require('../../infrastructure/logger/logger');

const ROLE_IDS = {
  student: 1,
  manager: 2,
  admin: 3,
};

class RegisterUser {
  constructor(userRepo, emailNotifier, bcrypt) {
    this.userRepo = userRepo;
    this.emailNotifier = emailNotifier;
    this.bcrypt = bcrypt;
  }

  async execute({ name, email, password, role }) {
    logger.info(`Intento de registro: ${email}`);

    try {
      if (!email.endsWith('@uce.edu.ec')) {
        logger.warn(`Registro rechazado — email no institucional: ${email}`);
        throw new Error('Solo se permiten correos institucionales @uce.edu.ec');
      }

      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser) {
        logger.warn(`Registro fallido — email ya registrado: ${email}`);
        throw new Error('El correo ya está registrado');
      }

      const passwordHash = await this.bcrypt.hash(password, 10);

      const roleId = ROLE_IDS[role] || ROLE_IDS.student;

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      logger.info(`Enviando código de verificación a: ${email}`);
      await this.emailNotifier.sendVerificationCode(email, code);

      const user = User.create({ name, email, passwordHash, roleId });
      const savedUser = await this.userRepo.save(user);
      await this.userRepo.saveVerifyCode(savedUser.id, code, expiresAt);

      logger.info(`Usuario registrado exitosamente: ${email}`);

      return savedUser.toJSON();
    } catch (error) {
      logger.error(`Error en registro: ${error.message}`);
      throw error;
    }
  }
}

module.exports = RegisterUser;
