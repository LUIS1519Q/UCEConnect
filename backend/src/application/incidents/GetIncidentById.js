class GetIncidentById {
  constructor(incidentRepo) {
    this.incidentRepo = incidentRepo;
  }

  async execute({ id, role, userId }) {
    const incident = await this.incidentRepo.findById(id);
    if (!incident) {
      throw new Error('Incidencia no encontrada');
    }

    if (role === 'student' && incident.createdBy !== userId) {
      throw new Error('No tienes permiso para ver esta incidencia');
    }

    const history = await this.incidentRepo.findHistoryByIncidentId(id);

    return { ...incident.toJSON(), history };
  }
}

module.exports = GetIncidentById;
