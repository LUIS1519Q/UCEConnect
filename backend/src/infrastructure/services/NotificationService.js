class NotificationService {
  constructor(io, notificationRepo, logger) {
    this.io = io;
    this.notificationRepo = notificationRepo;
    this.logger = logger;
  }

  async notify({ userId, incidentId, ticket, type, title }) {
    const notification = await this.notificationRepo.save({
      userId,
      incidentId,
      ticket,
      type,
      title,
      read: false,
      createdAt: new Date(),
    });
    this.io.to(`user_${userId}`).emit('notification', notification.toJSON());
    this.logger.info(`Notificación emitida: userId=${userId} type=${type}`);
    return notification;
  }
}

module.exports = NotificationService;
