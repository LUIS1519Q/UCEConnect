class GetNotifications {
  constructor(notificationRepo, logger) {
    this.notificationRepo = notificationRepo;
    this.logger = logger;
  }

  async execute({ userId, page, limit, unread }) {
    const result = await this.notificationRepo.findByUserId(userId, { page, limit, unread });
    this.logger.info(`Notificaciones obtenidas: userId=${userId}`);
    return result;
  }
}

module.exports = GetNotifications;
