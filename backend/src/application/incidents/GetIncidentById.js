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

    const [history, conversationCount] = await Promise.all([
      this.incidentRepo.findHistoryByIncidentId(id),
      this.incidentRepo.countObservationsByIncidentId(id),
    ]);

    const timeline = history.map((h) => ({
      id: h.id,
      status: h.status,
      changedBy: h.changedByName,
      statusComment: h.note,
      changedAt: h.changedAt,
    }));

    return {
      incident: {
        id: incident.id,
        ticket: incident.ticket,
        title: incident.title,
        description: incident.description,
        status: incident.status,
        statusReason: incident.statusReason,
        priority: incident.priority,
        aiSummary: incident.aiSummary,
        createdAt: incident.createdAt,
        updatedAt: incident.updatedAt,
      },
      attachments: [],
      conversationCount,
      timeline,
    };
  }
}

module.exports = GetIncidentById;
