const Incident = require('../../domain/incidents/Incident');

class CreateIncident {
  constructor(incidentRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.logger = logger;
  }

  async execute({ title, description, categoryId, createdBy }) {
    this.logger.info(`Creando incidencia para usuario ${createdBy}`);

    const exists = await this.incidentRepo.categoryExists(categoryId);
    if (!exists) {
      throw new Error('La categoría especificada no existe');
    }

    const incident = Incident.create({ title, description, categoryId, createdBy });
    const saved = await this.incidentRepo.create(incident);

    await this.incidentRepo.saveHistory(saved.id, 'open', createdBy, 'Incidencia creada');

    this.logger.info(`Incidencia ${saved.id} creada exitosamente`);
    return saved.toJSON();
  }
}

module.exports = CreateIncident;
