class INotificationRepo {
  async save(notification) { throw new Error('Not implemented') }
  async findByUserId(userId, { page, limit, unread }) { throw new Error('Not implemented') }
  async findById(id) { throw new Error('Not implemented') }
  async markAsRead(id) { throw new Error('Not implemented') }
}

module.exports = INotificationRepo;
