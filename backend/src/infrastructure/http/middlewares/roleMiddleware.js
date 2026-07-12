const logger = require('../../logger/logger');

module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    logger.warn(`Access denied — role ${req.user.role} on ${req.method} ${req.path}`);
    return res.status(403).json({ message: 'Access denied — insufficient role', errorCode: 'INSUFFICIENT_ROLE' });
  }

  next();
};
