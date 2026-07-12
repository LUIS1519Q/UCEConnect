class IncidentStatus {
  static TRANSITIONS = {
    open: ['in_progress', 'rejected', 'cancelled'],
    in_progress: ['resolved', 'rejected'],
    resolved: [],
    rejected: [],
    cancelled: [],
  };

  constructor(status) {
    if (!IncidentStatus.isValid(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    this.status = status;
  }

  transitionTo(newStatus) {
    const allowed = IncidentStatus.TRANSITIONS[this.status];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Invalid transition: cannot go from ${this.status} to ${newStatus}`
      );
    }
    return newStatus;
  }

  static isValid(status) {
    return Object.prototype.hasOwnProperty.call(IncidentStatus.TRANSITIONS, status);
  }
}

module.exports = IncidentStatus;
