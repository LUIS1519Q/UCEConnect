class User {
  constructor({ id, name, email, passwordHash, roleId, isActive, isVerified, createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.roleId = roleId;
    this.isActive = isActive;
    this.isVerified = isVerified;
    this.createdAt = createdAt;
  }

  static create({ name, email, passwordHash, roleId }) {
    return new User({
      name,
      email,
      passwordHash,
      roleId,
      isActive: true,
      isVerified: false,
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      roleId: this.roleId,
      isActive: this.isActive,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
