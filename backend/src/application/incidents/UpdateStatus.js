const IncidentStatus = require('../../domain/incidents/IncidentStatus');

class UpdateStatus {
  constructor(incidentRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.logger = logger;
  }

  async execute({ id, newStatus, changedBy, note }) {
    const incident = await this.incidentRepo.findById(id);
    if (!incident) {
      throw new Error('Incidencia no encontrada');
    }

    const currentStatus = new IncidentStatus(incident.status);
    currentStatus.transitionTo(newStatus);

    this.logger.info(`Cambiando estado de incidencia ${id}: ${incident.status} → ${newStatus}`);

    const updated = await this.incidentRepo.updateStatus(id, newStatus);
    await this.incidentRepo.saveHistory(id, newStatus, changedBy, note);

    this.logger.info(`Incidencia ${id} actualizada a ${newStatus}`);
    return updated.toJSON();
  }
}

module.exports = UpdateStatus;
