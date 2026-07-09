class Observation {
  constructor({ id, incidentId, authorId, authorName, authorRole, message, createdAt }) {
    this.id = id;
    this.incidentId = incidentId;
    this.authorId = authorId;
    this.authorName = authorName;
    this.authorRole = authorRole;
    this.message = message;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      incidentId: this.incidentId,
      authorId: this.authorId,
      authorName: this.authorName,
      authorRole: this.authorRole,
      message: this.message,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Observation;
