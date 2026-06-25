class UpdateIncident {
  constructor(incidentRepo) {
    this.incidentRepo = incidentRepo;
  }

  async execute({ id, title, description, categoryId, userId }) {
    const incident = await this.incidentRepo.findById(id);
    if (!incident) {
      throw new Error('Incidencia no encontrada');
    }

    if (incident.createdBy !== userId) {
      throw new Error('No tienes permiso para editar esta incidencia');
    }

    if (incident.status !== 'open') {
      throw new Error('Solo se pueden editar incidencias en estado open');
    }

    if (categoryId !== undefined) {
      const exists = await this.incidentRepo.categoryExists(categoryId);
      if (!exists) {
        throw new Error('La categoría especificada no existe');
      }
    }

    const updated = await this.incidentRepo.update(id, { title, description, categoryId });
    return updated.toJSON();
  }
}

module.exports = UpdateIncident;
