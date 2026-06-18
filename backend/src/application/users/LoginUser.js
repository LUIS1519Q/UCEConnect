const logger = require('../../infrastructure/logger/logger');

const ROLE_NAMES = {
  1: 'student',
  2: 'manager',
  3: 'admin',
};

class LoginUser {
  constructor(userRepo, bcrypt, jwt, jwtSecret, jwtRefreshSecret) {
    this.userRepo = userRepo;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
    this.jwtSecret = jwtSecret;
    this.jwtRefreshSecret = jwtRefreshSecret;
  }

  async execute({ email, password }) {
    logger.info(`Intento de login: ${email}`);

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      logger.warn(`Login fallido — usuario no encontrado: ${email}`);
      throw new Error('Credenciales inválidas');
    }

    if (!user.isVerified) {
      logger.warn(`Login fallido — cuenta no verificada: ${email}`);
      throw new Error('Debes verificar tu correo antes de iniciar sesión');
    }

    if (!user.isActive) {
      logger.warn(`Login fallido — cuenta desactivada: ${email}`);
      throw new Error('Tu cuenta ha sido desactivada');
    }

    const passwordMatches = await this.bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      logger.warn(`Login fallido — contraseña incorrecta: ${email}`);
      throw new Error('Credenciales inválidas');
    }

    const role = ROLE_NAMES[user.roleId] || 'student';

    const token = this.jwt.sign({ id: user.id, email: user.email, role }, this.jwtSecret, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign({ id: user.id }, this.jwtRefreshSecret, {
      expiresIn: '7d',
    });

    logger.info(`Login exitoso: ${email} rol:${role}`);

    return {
      accessToken: token,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role },
    };
  }
}

module.exports = LoginUser;
