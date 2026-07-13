const logger = require('../../infrastructure/logger/logger');

class UpdateIncident {
  constructor(incidentRepo) {
    this.incidentRepo = incidentRepo;
  }

  async execute({ id, title, description, categoryId, userId }) {
    const incident = await this.incidentRepo.findById(id);
    if (!incident) {
      logger.warn(`[UpdateIncident] INCIDENT_NOT_FOUND: id=${id}`);
      throw new Error('Incident not found');
    }

    if (incident.createdBy !== userId) {
      logger.warn(`[UpdateIncident] INSUFFICIENT_PERMISSION: userId=${userId} incidentId=${id}`);
      throw new Error('You do not have permission to edit this incident');
    }

    if (incident.status !== 'open') {
      logger.warn(`[UpdateIncident] BUSINESS_RULE_VIOLATION: incidentId=${id} status=${incident.status}`);
      throw new Error('Only incidents in open status can be edited');
    }

    if (categoryId !== undefined) {
      const exists = await this.incidentRepo.categoryExists(categoryId);
      if (!exists) {
        logger.warn(`[UpdateIncident] VALIDATION_ERROR: categoryId=${categoryId} not found`);
        throw new Error('The specified category does not exist');
      }
    }

    const updated = await this.incidentRepo.update(id, { title, description, categoryId });

    logger.info(`[UpdateIncident] success: incidentId=${id}`);

    return updated.toJSON();
  }
}

module.exports = UpdateIncident;
