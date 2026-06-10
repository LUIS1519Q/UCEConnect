// LoginUser.js — Caso de uso: iniciar sesión
// Valida las credenciales del usuario y emite los tokens de acceso (JWT) y de
// refresco. Las dependencias (repositorio, bcrypt, jwt y secretos) se inyectan
// por constructor para mantener el caso de uso ajeno a la infraestructura concreta.

// Mapea el id de rol almacenado en la BD al nombre de rol que viaja en el token
const ROLE_NAMES = {
  1: 'STUDENT',
  2: 'MANAGER',
  3: 'ADMIN',
};

class LoginUser {
  constructor(userRepo, bcrypt, jwt, jwtSecret, jwtRefreshSecret) {
    this.userRepo = userRepo;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
    this.jwtSecret = jwtSecret;
    this.jwtRefreshSecret = jwtRefreshSecret;
  }

  async execute({ email, password }) {
    // 1-2. El usuario debe existir
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // 3. La cuenta debe haber sido verificada por correo
    if (!user.isVerified) {
      throw new Error('Debes verificar tu correo antes de iniciar sesión');
    }

    // 4. La cuenta no debe estar desactivada
    if (!user.isActive) {
      throw new Error('Tu cuenta ha sido desactivada');
    }

    // 5-6. La contraseña debe coincidir con el hash almacenado
    const passwordMatches = await this.bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new Error('Credenciales inválidas');
    }

    const role = ROLE_NAMES[user.roleId] || 'student';

    // 7-8. Emite el token de acceso y el token de refresco
    const token = this.jwt.sign({ id: user.id, email: user.email, role }, this.jwtSecret, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign({ id: user.id }, this.jwtRefreshSecret, {
      expiresIn: '7d',
    });

    // 9. Retorna los tokens y los datos públicos del usuario
    return {
      accessToken: token,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role },
    };
  }
}

module.exports = LoginUser;
