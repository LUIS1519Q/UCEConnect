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
      logger.warn(`Reset failed — invalid or expired token: ${error.message}`);
      throw new Error('Invalid or expired reset token.');
    }

    if (decoded.purpose !== 'reset_password') {
      logger.warn('Reset failed — token has invalid purpose');
      throw new Error('Invalid reset token.');
    }

    const { email } = decoded;
    logger.info(`Password reset attempt: ${email}`);

    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        logger.warn(`Reset failed — user not found: ${email}`);
        throw new Error('User not found.');
      }

      const samePassword = await this.bcrypt.compare(newPassword, user.passwordHash);
      if (samePassword) {
        logger.warn(`Reset failed — same password: ${email}`);
        throw new Error('New password must be different from the current password.');
      }

      const passwordHash = await this.bcrypt.hash(newPassword, 10);
      await this.userRepo.updatePassword(user.id, passwordHash);

      logger.info(`Password updated for: ${email}`);

      return { message: 'Password updated successfully' };
    } catch (error) {
      logger.error(`Error in password reset: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ResetPassword;
