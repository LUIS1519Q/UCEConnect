const User = require('../../domain/users/User');

function rowToUser(row) {
  if (!row) return null;

  return new User({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    passwordHash: row.password_hash,
    roleId: row.role_id,
    isActive: row.is_active,
    isVerified: row.is_verified,
    createdAt: row.created_at,
    phone: row.phone,
    facultyId: row.faculty_id,
    careerId: row.career_id,
    avatarUrl: row.avatar_url,
    facultyName: row.faculty_name,
    careerName: row.career_name,
    roleName: row.role_name,
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
      `SELECT u.id, u.first_name, u.last_name, u.email,
              u.phone, u.avatar_url, u.faculty_id, u.career_id,
              r.name as role_name,
              f.name as faculty_name,
              c.name as career_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       LEFT JOIN faculties f ON u.faculty_id = f.id
       LEFT JOIN careers c ON u.career_id = c.id
       WHERE u.id = $1`,
      [id]
    );
    return rowToUser(result.rows[0]);
  }

  async save(user) {
    const result = await this.db.query(
      `INSERT INTO users (first_name, last_name, name, email, password_hash, role_id, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        user.firstName,
        user.lastName,
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.passwordHash,
        user.roleId,
        user.isActive,
        user.isVerified,
      ]
    );
    return rowToUser(result.rows[0]);
  }

  async saveWithTransaction(client, user) {
    const result = await client.query(
      `INSERT INTO users (first_name, last_name, name, email, password_hash, role_id, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        user.firstName,
        user.lastName,
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.passwordHash,
        user.roleId,
        user.isActive,
        user.isVerified,
      ]
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

  async findByRole(role) {
    const result = await this.db.query(
      `SELECT u.id, u.first_name, u.last_name, u.email,
              r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE r.name = $1 AND u.is_active = true`,
      [role]
    );
    return result.rows;
  }

  async updateProfile(userId, data) {
    await this.db.query(
      `UPDATE users SET
         first_name = COALESCE($2, first_name),
         last_name = COALESCE($3, last_name),
         phone = COALESCE($4, phone),
         faculty_id = COALESCE($5, faculty_id),
         career_id = COALESCE($6, career_id)
       WHERE id = $1`,
      [
        userId,
        data.firstName ?? null,
        data.lastName ?? null,
        data.phone ?? null,
        data.facultyId ?? null,
        data.careerId ?? null,
      ]
    );
  }

  async updateAvatar(userId, avatarUrl) {
    await this.db.query('UPDATE users SET avatar_url = $2 WHERE id = $1', [userId, avatarUrl]);
  }

  async findFaculties() {
    const result = await this.db.query('SELECT id, name FROM faculties ORDER BY name ASC');
    return result.rows;
  }

  async findCareersByFaculty(facultyId) {
    const result = await this.db.query(
      'SELECT id, name FROM careers WHERE faculty_id = $1 ORDER BY name ASC',
      [facultyId]
    );
    return result.rows;
  }

  async findCareerById(careerId) {
    const result = await this.db.query(
      'SELECT id, name, faculty_id FROM careers WHERE id = $1',
      [careerId]
    );
    return result.rows[0] || null;
  }

  async findAllUsers({ role, isActive, search, page = 1, limit = 10 } = {}) {
    const params = [];
    const conditions = [];

    if (role !== undefined) {
      params.push(role);
      conditions.push(`r.name = $${params.length}`);
    }
    if (isActive !== undefined) {
      params.push(isActive);
      conditions.push(`u.is_active = $${params.length}`);
    }
    if (search !== undefined) {
      params.push(`%${search}%`);
      conditions.push(
        `(u.first_name ILIKE $${params.length} OR u.last_name ILIKE $${params.length} OR u.email ILIKE $${params.length})`
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const offset = (page - 1) * limit;
    params.push(limit);
    const limitIdx = params.length;
    params.push(offset);
    const offsetIdx = params.length;

    const dataResult = await this.db.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.is_active, u.is_verified, u.created_at,
              r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ${where}
       ORDER BY u.created_at DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      params
    );

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM users u JOIN roles r ON u.role_id = r.id ${where}`,
      params.slice(0, params.length - 2)
    );

    return {
      data: dataResult.rows.map(rowToUser),
      total: parseInt(countResult.rows[0].count, 10),
    };
  }

  async updateRole(id, roleId) {
    await this.db.query('UPDATE users SET role_id = $2 WHERE id = $1', [id, roleId]);
  }

  async updateActiveStatus(id, isActive) {
    await this.db.query('UPDATE users SET is_active = $2 WHERE id = $1', [id, isActive]);
  }

  async findRoleIdByName(name) {
    const result = await this.db.query('SELECT id FROM roles WHERE name = $1', [name]);
    return result.rows[0] ? result.rows[0].id : null;
  }
}

module.exports = PostgresUserRepo;
