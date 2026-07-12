const Observation = require('../../domain/incidents/Observation');

class SendObservation {
  constructor(incidentRepo, observationRepo, logger, notificationService = null) {
    this.incidentRepo = incidentRepo;
    this.observationRepo = observationRepo;
    this.logger = logger;
    this.notificationService = notificationService;
  }

  async execute({ incidentId, authorId, authorName, authorRole, message }) {
    const incident = await this.incidentRepo.findById(incidentId);
    if (!incident) {
      throw new Error('Incident not found');
    }

    if (authorRole === 'student' && incident.createdBy !== authorId) {
      throw new Error('You do not have permission to comment on this incident');
    }

    if (!message || message.trim().length === 0) {
      throw new Error('The message cannot be empty');
    }

    if (message.trim().length > 1000) {
      throw new Error('The message cannot exceed 1000 characters');
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

    this.logger.info(`Observation sent: incidentId=${incidentId} authorId=${authorId}`);

    if (this.notificationService) {
      if (authorRole === 'student') {
        const targetUserId = incident.assignedTo;
        if (targetUserId) {
          await this.notificationService.notify({
            userId: targetUserId,
            incidentId,
            ticket: incident.ticket,
            type: 'student_reply',
            title: `Student replied on incident ${incident.ticket || incidentId}.`,
          });
        }
      }

      if (authorRole === 'manager' || authorRole === 'admin') {
        await this.notificationService.notify({
          userId: incident.createdBy,
          incidentId,
          ticket: incident.ticket,
          type: 'manager_request',
          title: 'The manager has sent you a message on your incident.',
        });
      }
    }

    return saved.toJSON();
  }
}

module.exports = SendObservation;
