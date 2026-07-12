const logger = require('../../infrastructure/logger/logger');

class CancelIncident {
  constructor(incidentRepo) {
    this.incidentRepo = incidentRepo;
  }

  async execute({ id, userId }) {
    const incident = await this.incidentRepo.findById(id);
    if (!incident) {
      logger.warn(`[CancelIncident] INCIDENT_NOT_FOUND: id=${id}`);
      throw new Error('Incident not found');
    }

    if (incident.createdBy !== userId) {
      logger.warn(`[CancelIncident] INSUFFICIENT_PERMISSION: userId=${userId} incidentId=${id}`);
      throw new Error('You do not have permission to cancel this incident');
    }

    if (incident.status !== 'open') {
      logger.warn(`[CancelIncident] BUSINESS_RULE_VIOLATION: incidentId=${id} status=${incident.status}`);
      throw new Error('Only incidents in open status can be cancelled');
    }

    const updated = await this.incidentRepo.updateStatus(id, 'cancelled');
    await this.incidentRepo.saveHistory(id, 'cancelled', userId, 'Cancelled by student');

    logger.info(`[CancelIncident] success: incidentId=${id}`);

    return updated.toJSON();
  }
}

module.exports = CancelIncident;
