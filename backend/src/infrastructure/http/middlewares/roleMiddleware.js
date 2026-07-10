const logger = require('../../logger/logger');

module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    logger.warn(`Acceso denegado — rol ${req.user.role} en ${req.method} ${req.path}`);
    return res.status(403).json({ message: 'Acceso denegado — rol insuficiente', errorCode: 'INSUFFICIENT_ROLE' });
  }

  next();
};
