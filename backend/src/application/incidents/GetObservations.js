class GetObservations {
  constructor(incidentRepo, observationRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.observationRepo = observationRepo;
    this.logger = logger;
  }

  async execute({ incidentId, role, userId }) {
    const incident = await this.incidentRepo.findById(incidentId);
    if (!incident) {
      throw new Error('Incident not found');
    }

    if (role === 'student' && incident.createdBy !== userId) {
      throw new Error('You do not have permission to view this incident');
    }

    const observations = await this.observationRepo.findByIncidentId(incidentId);

    this.logger.info(`Observations retrieved: incidentId=${incidentId}`);

    return observations;
  }
}

module.exports = GetObservations;
