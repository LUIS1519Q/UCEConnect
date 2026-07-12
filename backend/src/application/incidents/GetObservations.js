class GetObservations {
  constructor(incidentRepo, observationRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.observationRepo = observationRepo;
    this.logger = logger;
  }

  async execute({ incidentId, role, userId }) {
    const incident = await this.incidentRepo.findById(incidentId);
    if (!incident) {
      throw new Error('Incidencia no encontrada');
    }

    if (role === 'student' && incident.createdBy !== userId) {
      throw new Error('No tienes permiso para ver esta incidencia');
    }

    const observations = await this.observationRepo.findByIncidentId(incidentId);

    this.logger.info(`Observaciones obtenidas: incidentId=${incidentId}`);

    return observations;
  }
}

module.exports = GetObservations;
