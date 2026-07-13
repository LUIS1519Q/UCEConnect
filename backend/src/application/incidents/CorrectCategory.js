class CorrectCategory {
  constructor(incidentRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.logger = logger;
  }

  async execute({ id, categoryId }) {
    const incident = await this.incidentRepo.findById(id);
    if (!incident) {
      throw new Error('Incident not found');
    }

    if (['resolved', 'rejected', 'cancelled'].includes(incident.status)) {
      throw new Error('Category cannot be corrected on a closed incident.');
    }

    const exists = await this.incidentRepo.categoryExists(categoryId);
    if (!exists) {
      throw new Error('The specified category does not exist');
    }

    const updated = await this.incidentRepo.updateCategory(id, categoryId);
    this.logger.info(`Category corrected: incidentId=${id} categoryId=${categoryId}`);

    return updated.toJSON();
  }
}

module.exports = CorrectCategory;
