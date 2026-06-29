class User {
  constructor({ id, firstName, lastName, email, passwordHash, roleId, isActive, isVerified, createdAt }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.passwordHash = passwordHash;
    this.roleId = roleId;
    this.isActive = isActive;
    this.isVerified = isVerified;
    this.createdAt = createdAt;
  }

  static create({ firstName, lastName, email, passwordHash, roleId }) {
    return new User({
      firstName,
      lastName,
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
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      roleId: this.roleId,
      isActive: this.isActive,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
