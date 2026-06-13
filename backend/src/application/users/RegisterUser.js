// RegisterUser.js — Caso de uso: registrar un nuevo usuario
// Orquesta el dominio (User) con los puertos (IUserRepo, IEmailNotifier) y bcrypt,
// que se reciben por inyección de dependencias para mantener el caso de uso testeable
// e independiente de las implementaciones concretas de infraestructura.

const User = require('../../domain/users/User');

// Mapea el rol recibido al id de la tabla `roles` (1=student, 2=manager, 3=admin)
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

  async execute({ name, email, password, role }) {
    // 1. Solo se permiten correos institucionales de la UCE
    if (!email.endsWith('@uce.edu.ec')) {
      throw new Error('Solo se permiten correos institucionales @uce.edu.ec');
    }

    // 2. El correo no puede estar registrado previamente
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error('El correo ya está registrado');
    }

    // 3. Nunca se almacena la contraseña en texto plano
    const passwordHash = await this.bcrypt.hash(password, 10);

    // 4. Determina el rol (por defecto, estudiante)
    const roleId = ROLE_IDS[role] || ROLE_IDS.student;

    // Genera el código de verificación de 6 dígitos, válido por 5 minutos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 5. Envía el correo ANTES de persistir nada: si el envío falla, no debe
    // quedar ningún registro en la BD (de lo contrario, un reintento posterior
    // fallaría con "El correo ya está registrado" sin que el usuario haya
    // recibido jamás su código de verificación).
    await this.emailNotifier.sendVerificationCode(email, code);

    // 6. Solo si el correo se envió con éxito se crea y persiste al usuario
    const user = User.create({ name, email, passwordHash, roleId });
    const savedUser = await this.userRepo.save(user);
    await this.userRepo.saveVerifyCode(savedUser.id, code, expiresAt);

    // Retorna el usuario sin datos sensibles
    return savedUser.toJSON();
  }
}

module.exports = RegisterUser;
