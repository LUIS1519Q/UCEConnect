// authMiddleware.js — Middleware HTTP que protege rutas exigiendo un JWT válido
// Extrae el token del header Authorization, lo verifica y expone el payload
// decodificado en req.user para que los siguientes handlers lo usen.

const jwt = require('jsonwebtoken');
const logger = require('../../logger/logger');

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    logger.warn(`Request sin token: ${req.method} ${req.path}`);
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    logger.debug(`Token válido — user: ${decoded.email} en ${req.path}`);
    next();
  } catch (error) {
    logger.warn(`Token inválido en: ${req.method} ${req.path}`);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
