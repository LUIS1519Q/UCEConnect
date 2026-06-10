// User.js — Entidad de dominio
// Representa a un usuario de la plataforma. No depende de ninguna librería externa
// ni de las capas de aplicación/infraestructura (dominio puro).

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

  // Crea un nuevo usuario con los valores por defecto de un registro recién creado
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

  // Representación segura del usuario: nunca expone el hash de la contraseña
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
