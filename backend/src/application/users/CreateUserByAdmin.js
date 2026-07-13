const crypto = require('crypto');
const User = require('../../domain/users/User');

class CreateUserByAdmin {
  constructor(userRepo, forgotPassword, bcrypt, logger, emailNotifier) {
    this.userRepo = userRepo;
    this.forgotPassword = forgotPassword;
    this.bcrypt = bcrypt;
    this.logger = logger;
    this.emailNotifier = emailNotifier;
  }

  async execute({ firstName, lastName, email, role }) {
    if (!email.endsWith('@uce.edu.ec')) {
      throw new Error('Only institutional emails are allowed (@uce.edu.ec).');
    }

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    const roleId = await this.userRepo.findRoleIdByName(role);
    if (!roleId) {
      throw new Error('The specified role does not exist');
    }

    const passwordHash = await this.bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);

    const user = User.create({ firstName, lastName, email, passwordHash, roleId, isVerified: true });
    const savedUser = await this.userRepo.save(user);

    await this.emailNotifier.sendAdminWelcome(email, firstName);
    await this.forgotPassword.execute({ email });

    this.logger.info(`User created by admin: ${email} role=${role}`);

    return savedUser.toJSON();
  }
}

module.exports = CreateUserByAdmin;
