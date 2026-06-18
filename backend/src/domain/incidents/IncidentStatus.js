class IncidentStatus {
  static TRANSITIONS = {
    open: ['in_progress', 'rejected'],
    in_progress: ['resolved', 'rejected'],
    resolved: [],
    rejected: [],
  };

  constructor(status) {
    if (!IncidentStatus.isValid(status)) {
      throw new Error(`Estado inválido: ${status}`);
    }
    this.status = status;
  }

  transitionTo(newStatus) {
    const allowed = IncidentStatus.TRANSITIONS[this.status];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Transición inválida: no se puede pasar de ${this.status} a ${newStatus}`
      );
    }
    return newStatus;
  }

  static isValid(status) {
    return Object.prototype.hasOwnProperty.call(IncidentStatus.TRANSITIONS, status);
  }
}

module.exports = IncidentStatus;
