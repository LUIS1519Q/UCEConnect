const crypto = require('crypto');
const logger = require('../../infrastructure/logger/logger');
const User = require('../../domain/users/User');

const ROLE_NAMES = {
  1: 'student',
  2: 'manager',
  3: 'admin',
};

class LoginWithMicrosoft {
  constructor(userRepo, microsoftAuthService, jwt, jwtSecret, jwtRefreshSecret, bcrypt) {
    this.userRepo = userRepo;
    this.microsoftAuthService = microsoftAuthService;
    this.jwt = jwt;
    this.jwtSecret = jwtSecret;
    this.jwtRefreshSecret = jwtRefreshSecret;
    this.bcrypt = bcrypt;
  }

  async execute({ code }) {
    const result = await this.microsoftAuthService.getTokenFromCode(code);
    const profile = await this.microsoftAuthService.getUserProfile(result.accessToken);

    const email = profile.mail || profile.userPrincipalName;

    if (!email || !email.endsWith('@uce.edu.ec')) {
      logger.warn(`Login con Microsoft rechazado — correo no institucional: ${email}`);
      throw new Error('Solo se permiten correos institucionales @uce.edu.ec');
    }

    let user = await this.userRepo.findByEmail(email);
    let isNewUser = false;

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const passwordHash = await this.bcrypt.hash(randomPassword, 10);

      user = await this.userRepo.save(
        new User({
          name: profile.displayName,
          email,
          passwordHash,
          roleId: 1,
          isActive: true,
          isVerified: true,
        })
      );
      isNewUser = true;
      logger.info(`Usuario creado vía Microsoft: ${email}`);
    } else if (!user.isActive) {
      logger.warn(`Login con Microsoft fallido — cuenta desactivada: ${email}`);
      throw new Error('Tu cuenta ha sido desactivada');
    }

    const role = ROLE_NAMES[user.roleId] || 'student';

    const accessToken = this.jwt.sign({ id: user.id, email: user.email, role }, this.jwtSecret, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign({ id: user.id }, this.jwtRefreshSecret, {
      expiresIn: '7d',
    });

    logger.info(`Login con Microsoft exitoso para: ${email}`);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role },
      isNewUser,
    };
  }
}

module.exports = LoginWithMicrosoft;
