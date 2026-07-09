class UpdateFaqItem {
  constructor(helpItemRepo, logger) {
    this.helpItemRepo = helpItemRepo;
    this.logger = logger;
  }

  async execute({ id, question, answer, order }) {
    const item = await this.helpItemRepo.findById(id);
    if (!item) {
      throw new Error('Pregunta no encontrada');
    }

    const updated = await this.helpItemRepo.update(id, { question, answer, order });

    this.logger.info(`Pregunta frecuente actualizada: id=${id}`);

    return updated.toJSON();
  }
}

module.exports = UpdateFaqItem;
