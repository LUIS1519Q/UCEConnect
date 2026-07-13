class GetSimilarIncident {
  constructor(incidentRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.logger = logger;
  }

  async execute({ id, userId, role }) {
    const incident = await this.incidentRepo.findById(id);
    if (!incident) {
      throw new Error('Incident not found.');
    }

    if (role === 'student' && incident.createdBy !== userId) {
      throw new Error('You do not have permission to view this incident.');
    }

    return {
      id: incident.id,
      title: incident.title,
      description: incident.description,
      status: incident.status,
      statusReason: incident.statusReason || null,
      updatedAt: incident.updatedAt,
    };
  }
}

module.exports = GetSimilarIncident;
