const InternalNote = require('../../domain/incidents/InternalNote');

class AddInternalNote {
  constructor(incidentRepo, internalNoteRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.internalNoteRepo = internalNoteRepo;
    this.logger = logger;
  }

  async execute({ incidentId, authorId, authorName, authorRole, message }) {
    const incident = await this.incidentRepo.findById(incidentId);
    if (!incident) {
      throw new Error('Incidencia no encontrada');
    }

    const note = new InternalNote({
      incidentId,
      authorId,
      authorName,
      authorRole,
      message,
      createdAt: new Date(),
    });

    const saved = await this.internalNoteRepo.save(note);

    this.logger.info(`Nota interna agregada: incidentId=${incidentId} authorId=${authorId}`);

    return saved.toJSON();
  }
}

module.exports = AddInternalNote;
