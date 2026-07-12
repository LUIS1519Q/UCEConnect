const logger = require('../../infrastructure/logger/logger');

class GetIncidentById {
  constructor(incidentRepo, attachmentRepo, internalNoteRepo) {
    this.incidentRepo = incidentRepo;
    this.attachmentRepo = attachmentRepo;
    this.internalNoteRepo = internalNoteRepo;
  }

  async execute({ id, role, userId }) {
    const incident = await this.incidentRepo.findById(id);
    if (!incident) {
      logger.warn(`[GetIncidentById] INCIDENT_NOT_FOUND: id=${id}`);
      throw new Error('Incident not found');
    }

    if (role === 'student' && incident.createdBy !== userId) {
      logger.warn(`[GetIncidentById] INSUFFICIENT_PERMISSION: userId=${userId} incidentId=${id}`);
      throw new Error('You do not have permission to view this incident');
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

    logger.info(`[GetIncidentById] success: incidentId=${id}`);

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
