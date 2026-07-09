class Notification {
  constructor({ id, userId, incidentId, ticket, type, title, read, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.incidentId = incidentId;
    this.ticket = ticket;
    this.type = type;
    this.title = title;
    this.read = read;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      incidentId: this.incidentId,
      ticket: this.ticket,
      type: this.type,
      title: this.title,
      read: this.read,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Notification;
