const GetNotifications = require('../../../application/notifications/GetNotifications');
const MarkNotificationRead = require('../../../application/notifications/MarkNotificationRead');
const PostgresNotificationRepo = require('../../repositories/PostgresNotificationRepo');
const db = require('../../db/connection');
const logger = require('../../logger/logger');

const notificationRepo = new PostgresNotificationRepo(db);

async function list(req, res) {
  try {
    const { page, limit, unread } = req.query;
    const useCase = new GetNotifications(notificationRepo, logger);
    const result = await useCase.execute({
      userId: req.user.id,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      unread: unread === 'true',
    });
    return res.status(200).json(result);
  } catch (err) {
    logger.warn(`Error en list notifications: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function markRead(req, res) {
  try {
    const useCase = new MarkNotificationRead(notificationRepo, logger);
    const result = await useCase.execute({
      id: Number(req.params.id),
      userId: req.user.id,
    });
    return res.status(200).json(result);
  } catch (err) {
    logger.warn(`Error en markRead: ${err.message}`);
    if (err.message.includes('not found')) return res.status(404).json({ message: err.message, errorCode: 'NOTIFICATION_NOT_FOUND' });
    if (err.message.includes('permission')) return res.status(403).json({ message: err.message, errorCode: 'INSUFFICIENT_PERMISSION' });
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

module.exports = { list, markRead };
