class User {
  constructor({
    id,
    firstName,
    lastName,
    email,
    passwordHash,
    roleId,
    isActive,
    isVerified,
    createdAt,
    phone,
    facultyId,
    careerId,
    avatarUrl,
    facultyName,
    careerName,
    roleName,
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.passwordHash = passwordHash;
    this.roleId = roleId;
    this.isActive = isActive;
    this.isVerified = isVerified;
    this.createdAt = createdAt;
    this.phone = phone || null;
    this.facultyId = facultyId || null;
    this.careerId = careerId || null;
    this.avatarUrl = avatarUrl || null;
    this.facultyName = facultyName || null;
    this.careerName = careerName || null;
    this.roleName = roleName || null;
  }

  static create({ firstName, lastName, email, passwordHash, roleId, isVerified }) {
    return new User({
      firstName,
      lastName,
      email,
      passwordHash,
      roleId,
      isActive: true,
      isVerified: isVerified || false,
    });
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      roleId: this.roleId,
      roleName: this.roleName,
      isActive: this.isActive,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
      phone: this.phone,
      facultyId: this.facultyId,
      careerId: this.careerId,
      avatarUrl: this.avatarUrl,
    };
  }
}

module.exports = User;
