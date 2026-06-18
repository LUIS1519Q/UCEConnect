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

    const [history, observations] = await Promise.all([
      this.incidentRepo.findHistoryByIncidentId(id),
      this.incidentRepo.findObservationsByIncidentId(id),
    ]);

    const historyEvents = history.map(h => ({
      type: 'status_change',
      timestamp: h.changedAt,
      actor: h.changedByName,
      actorRole: null,
      content: h.status,
    }));

    const observationEvents = observations.map(o => ({
      type: 'observation',
      timestamp: o.createdAt,
      actor: o.authorName,
      actorRole: o.authorRole,
      content: o.message,
    }));

    const timeline = [...historyEvents, ...observationEvents]
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return {
      ...incident.toJSON(),
      history,
      observations,
      timeline,
    };
  }
}

module.exports = GetIncidentById;
