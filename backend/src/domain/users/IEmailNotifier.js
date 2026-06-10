// IEmailNotifier.js — Puerto (interfaz) del dominio para el envío de notificaciones por correo
// Define el contrato que cualquier adaptador de infraestructura debe cumplir.
// No contiene implementación: permite que la capa de aplicación dependa de esta
// abstracción en lugar de una librería concreta de envío de correos (p.ej. Nodemailer).

/**
 * @interface IEmailNotifier
 *
 * @function sendVerificationCode
 * @param {string} email - Correo institucional del destinatario
 * @param {string} code - Código de verificación de 6 dígitos
 * @returns {Promise<void>} Envía el correo con el código de verificación de la cuenta
 *
 * @function sendWelcome
 * @param {string} email - Correo institucional del destinatario
 * @param {string} name - Nombre del usuario
 * @returns {Promise<void>} Envía el correo de bienvenida tras verificar la cuenta
 */
