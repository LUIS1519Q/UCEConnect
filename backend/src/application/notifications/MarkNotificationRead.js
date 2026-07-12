class MarkNotificationRead {
  constructor(notificationRepo, logger) {
    this.notificationRepo = notificationRepo;
    this.logger = logger;
  }

  async execute({ id, userId }) {
    const notification = await this.notificationRepo.findById(id);
    if (!notification) {
      throw new Error('Notification not found.');
    }

    if (notification.userId !== userId) {
      throw new Error('You do not have permission to access this notification.');
    }

    await this.notificationRepo.markAsRead(id);
    this.logger.info(`Notification marked as read: id=${id}`);

    return { message: 'Notification marked as read.' };
  }
}

module.exports = MarkNotificationRead;
