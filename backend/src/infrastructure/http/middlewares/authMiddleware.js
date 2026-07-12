const jwt = require('jsonwebtoken');
const logger = require('../../logger/logger');

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    logger.warn(`Request without token: ${req.method} ${req.path}`);
    return res.status(401).json({ message: 'Token required', errorCode: 'TOKEN_REQUIRED' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      ...decoded,
      role: decoded.role.toLowerCase()
    };
    logger.debug(`Valid token — user: ${decoded.email} on ${req.path}`);
    next();
  } catch (error) {
    logger.warn(`Invalid token on: ${req.method} ${req.path}`);
    return res.status(401).json({ message: 'Invalid or expired token', errorCode: 'TOKEN_INVALID' });
  }
};
