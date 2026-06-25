const User = require('../../domain/users/User');

function rowToUser(row) {
  if (!row) return null;

  return new User({
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    roleId: row.role_id,
    isActive: row.is_active,
    isVerified: row.is_verified,
    createdAt: row.created_at,
  });
}

class PostgresUserRepo {
  constructor(db) {
    this.db = db;
  }

  async findByEmail(email) {
    const result = await this.db.query(
      `SELECT u.*, r.name as role_name FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1`,
      [email]
    );
    return rowToUser(result.rows[0]);
  }

  async findById(id) {
    const result = await this.db.query(
      `SELECT u.*, r.name as role_name FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [id]
    );
    return rowToUser(result.rows[0]);
  }

  async save(user) {
    const result = await this.db.query(
      `INSERT INTO users (name, email, password_hash, role_id, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user.name, user.email, user.passwordHash, user.roleId, user.isActive, user.isVerified]
    );
    return rowToUser(result.rows[0]);
  }

  async saveWithTransaction(client, user) {
    const result = await client.query(
      `INSERT INTO users (name, email, password_hash, role_id, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user.name, user.email, user.passwordHash, user.roleId, user.isActive, user.isVerified]
    );
    return rowToUser(result.rows[0]);
  }

  async saveVerifyCodeWithTransaction(client, userId, code, expiresAt) {
    await client.query(
      'INSERT INTO verify_codes (user_id, code, expires_at) VALUES ($1, $2, $3)',
      [userId, code, expiresAt]
    );
  }

  async deleteByEmail(email) {
    await this.db.query('DELETE FROM users WHERE email = $1', [email]);
  }

  async updateVerified(userId) {
    await this.db.query('UPDATE users SET is_verified = true WHERE id = $1', [userId]);
  }

  async saveVerifyCode(userId, code, expiresAt) {
    await this.db.query(
      'INSERT INTO verify_codes (user_id, code, expires_at) VALUES ($1, $2, $3)',
      [userId, code, expiresAt]
    );
  }

  async findVerifyCode(email) {
    const result = await this.db.query(
      `SELECT vc.* FROM verify_codes vc
       JOIN users u ON vc.user_id = u.id
       WHERE u.email = $1 AND vc.used = false
       ORDER BY vc.created_at DESC
       LIMIT 1`,
      [email]
    );

    const row = result.rows[0];
    if (!row) return null;

    return { code: row.code, expiresAt: row.expires_at, used: row.used };
  }

  async markCodeAsUsed(email) {
    await this.db.query(
      `UPDATE verify_codes SET used = true
       WHERE user_id = (SELECT id FROM users WHERE email = $1)
       AND used = false`,
      [email]
    );
  }

  async deleteVerifyCodesByUserId(userId) {
    await this.db.query(
      `DELETE FROM verify_codes WHERE user_id = $1 AND used = false`,
      [userId]
    );
  }

  async saveResetCode(userId, code, expiresAt) {
    await this.db.query(
      'INSERT INTO password_reset_codes (user_id, code, expires_at) VALUES ($1, $2, $3)',
      [userId, code, expiresAt]
    );
  }

  async findResetCode(email) {
    const result = await this.db.query(
      `SELECT prc.* FROM password_reset_codes prc
       JOIN users u ON prc.user_id = u.id
       WHERE u.email = $1 AND prc.used = false
       ORDER BY prc.created_at DESC
       LIMIT 1`,
      [email]
    );

    const row = result.rows[0];
    if (!row) return null;

    return { code: row.code, expiresAt: row.expires_at, used: row.used };
  }

  async markResetCodeAsUsed(email) {
    await this.db.query(
      `UPDATE password_reset_codes SET used = true
       WHERE user_id = (SELECT id FROM users WHERE email = $1)
       AND used = false`,
      [email]
    );
  }

  async updatePassword(userId, passwordHash) {
    await this.db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
  }

  async deleteResetCodesByUserId(userId) {
    await this.db.query(
      'DELETE FROM password_reset_codes WHERE user_id = $1 AND used = false',
      [userId]
    );
  }
}

module.exports = PostgresUserRepo;
