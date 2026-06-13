// IUserRepo.js — Puerto (interfaz) del dominio para la persistencia de usuarios
// Define el contrato que cualquier adaptador de infraestructura debe cumplir.
// No contiene implementación: documenta únicamente la forma del repositorio
// para que la capa de aplicación pueda depender de esta abstracción y no de pg/PostgreSQL.

/**
 * @interface IUserRepo
 *
 * @function findByEmail
 * @param {string} email
 * @returns {Promise<import('./User')|null>} El usuario encontrado o null si no existe
 *
 * @function findById
 * @param {number} id
 * @returns {Promise<import('./User')|null>} El usuario encontrado o null si no existe
 *
 * @function save
 * @param {import('./User')} user
 * @returns {Promise<import('./User')>} El usuario persistido (con su id asignado)
 *
 * @function updateVerified
 * @param {number} userId
 * @returns {Promise<void>} Marca al usuario como verificado (is_verified = true)
 *
 * @function saveVerifyCode
 * @param {number} userId
 * @param {string} code
 * @param {Date} expiresAt
 * @returns {Promise<void>} Persiste un código de verificación para el usuario
 *
 * @function findVerifyCode
 * @param {string} email
 * @returns {Promise<{ code: string, expiresAt: Date, used: boolean }|null>} El código de verificación vigente más reciente, o null
 *
 * @function markCodeAsUsed
 * @param {string} email
 * @returns {Promise<void>} Marca el código de verificación vigente del usuario como utilizado
 */
