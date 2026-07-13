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

  async execute({ firstName, lastName, email, password }) {
    logger.info(`Registration attempt: ${email}`);

    try {
      if (!email.endsWith('@uce.edu.ec')) {
        logger.warn(`Registration rejected — non-institutional email: ${email}`);
        throw new Error('Only institutional emails are allowed (@uce.edu.ec).');
      }

      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser) {
        logger.warn(`Registration failed — email already registered: ${email}`);
        throw new Error('Email is already registered.');
      }

      const passwordHash = await this.bcrypt.hash(password, 10);

      const roleId = ROLE_IDS.student;

      const code = require('crypto').randomInt(100000, 999999).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      logger.info(`Sending verification code to: ${email}`);
      await this.emailNotifier.sendVerificationCode(email, code);

      const user = User.create({ firstName, lastName, email, passwordHash, roleId });
      const savedUser = await this.userRepo.save(user);
      await this.userRepo.saveVerifyCode(savedUser.id, code, expiresAt);

      logger.info(`User registered successfully: ${email}`);

      return savedUser.toJSON();
    } catch (error) {
      logger.error(`Error in registration: ${error.message}`);
      throw error;
    }
  }
}

module.exports = RegisterUser;
