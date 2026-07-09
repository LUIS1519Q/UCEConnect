const IncidentStatus = require('../../domain/incidents/IncidentStatus');

class UpdateStatus {
  constructor(incidentRepo, logger, notificationService = null) {
    this.incidentRepo = incidentRepo;
    this.logger = logger;
    this.notificationService = notificationService;
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

    if (this.notificationService) {
      const statusLabels = {
        in_progress: 'Your incident is now being reviewed.',
        resolved: 'Your incident has been resolved.',
        rejected: 'Your incident has been rejected.',
        cancelled: 'Your incident has been cancelled.',
      };

      await this.notificationService.notify({
        userId: updated.createdBy,
        incidentId: updated.id,
        ticket: updated.ticket,
        type: 'status_updated',
        title: statusLabels[newStatus] || `Incident status updated to ${newStatus}.`,
      });
    }

    return updated.toJSON();
  }
}

module.exports = UpdateStatus;
