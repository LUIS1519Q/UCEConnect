class CorrectCategory {
  constructor(incidentRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.logger = logger;
  }

  async execute({ id, categoryId }) {
    const incident = await this.incidentRepo.findById(id);
    if (!incident) {
      throw new Error('Incidencia no encontrada');
    }

    const exists = await this.incidentRepo.categoryExists(categoryId);
    if (!exists) {
      throw new Error('La categoría especificada no existe');
    }

    const updated = await this.incidentRepo.updateCategory(id, categoryId);
    this.logger.info(`Categoría corregida: incidentId=${id} categoryId=${categoryId}`);

    return updated.toJSON();
  }
}

module.exports = CorrectCategory;
