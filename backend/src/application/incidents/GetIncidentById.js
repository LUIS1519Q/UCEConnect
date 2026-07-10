class GetIncidentById {
  constructor(incidentRepo, attachmentRepo, internalNoteRepo) {
    this.incidentRepo = incidentRepo;
    this.attachmentRepo = attachmentRepo;
    this.internalNoteRepo = internalNoteRepo;
  }

  async execute({ id, role, userId }) {
    const incident = await this.incidentRepo.findById(id);
    if (!incident) {
      throw new Error('Incidencia no encontrada');
    }

    if (role === 'student' && incident.createdBy !== userId) {
      throw new Error('No tienes permiso para ver esta incidencia');
    }

    const [history, conversationCount, attachments, internalNotes] = await Promise.all([
      this.incidentRepo.findHistoryByIncidentId(id),
      this.incidentRepo.countObservationsByIncidentId(id),
      this.attachmentRepo.findByIncidentId(id),
      role === 'student' ? Promise.resolve([]) : this.internalNoteRepo.findByIncidentId(id),
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
        categoryId: incident.categoryId,
        categoryName: incident.categoryName,
        status: incident.status,
        statusReason: incident.statusReason,
        priority: incident.priority,
        aiSummary: incident.aiSummary,
        createdBy: incident.createdBy,
        createdByName: incident.createdByName,
        assignedTo: incident.assignedTo,
        assignedToName: incident.assignedToName,
        createdAt: incident.createdAt,
        updatedAt: incident.updatedAt,
      },
      attachments: attachments.map((attachment) => attachment.toJSON()),
      conversationCount,
      timeline,
      ...(role !== 'student' && { internalNotes: internalNotes.map((note) => note.toJSON()) }),
    };
  }
}

module.exports = GetIncidentById;
