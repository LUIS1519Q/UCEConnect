class CancelIncident {
  constructor(incidentRepo) {
    this.incidentRepo = incidentRepo;
  }

  async execute({ id, userId }) {
    const incident = await this.incidentRepo.findById(id);
    if (!incident) {
      throw new Error('Incidencia no encontrada');
    }

    if (incident.createdBy !== userId) {
      throw new Error('No tienes permiso para cancelar esta incidencia');
    }

    if (incident.status !== 'open') {
      throw new Error('Solo se pueden cancelar incidencias en estado open');
    }

    const updated = await this.incidentRepo.updateStatus(id, 'rejected');
    await this.incidentRepo.saveHistory(id, 'rejected', userId, 'Cancelada por el estudiante');

    return updated.toJSON();
  }
}

module.exports = CancelIncident;
