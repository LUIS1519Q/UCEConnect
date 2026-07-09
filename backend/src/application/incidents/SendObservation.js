const Observation = require('../../domain/incidents/Observation');

class SendObservation {
  constructor(incidentRepo, observationRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.observationRepo = observationRepo;
    this.logger = logger;
  }

  async execute({ incidentId, authorId, authorName, authorRole, message }) {
    const incident = await this.incidentRepo.findById(incidentId);
    if (!incident) {
      throw new Error('Incidencia no encontrada');
    }

    if (authorRole === 'student' && incident.createdBy !== authorId) {
      throw new Error('No tienes permiso para comentar en esta incidencia');
    }

    if (!message || message.trim().length === 0) {
      throw new Error('El mensaje no puede estar vacío');
    }

    if (message.trim().length > 1000) {
      throw new Error('El mensaje no puede superar los 1000 caracteres');
    }

    const observation = new Observation({
      incidentId,
      authorId,
      authorName,
      authorRole,
      message: message.trim(),
      createdAt: new Date(),
    });

    const saved = await this.observationRepo.save(observation);

    this.logger.info(`Observación enviada: incidentId=${incidentId} authorId=${authorId}`);

    return saved.toJSON();
  }
}

module.exports = SendObservation;
