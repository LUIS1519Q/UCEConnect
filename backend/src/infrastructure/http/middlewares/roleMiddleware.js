// roleMiddleware.js — Middleware HTTP factory que restringe el acceso por rol
// Debe usarse después de authMiddleware, ya que depende de req.user.role.
// Uso: router.get('/ruta', authMiddleware, roleMiddleware('admin', 'manager'), handler)

const logger = require('../../logger/logger');

module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    logger.warn(`Acceso denegado — rol ${req.user.role} en ${req.method} ${req.path}`);
    return res.status(403).json({ error: 'Acceso denegado — rol insuficiente' });
  }

  next();
};
