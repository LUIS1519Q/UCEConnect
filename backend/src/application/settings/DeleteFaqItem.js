class DeleteFaqItem {
  constructor(helpItemRepo, logger) {
    this.helpItemRepo = helpItemRepo;
    this.logger = logger;
  }

  async execute({ id }) {
    const item = await this.helpItemRepo.findById(id);
    if (!item) {
      throw new Error('Pregunta no encontrada');
    }

    await this.helpItemRepo.delete(id);

    this.logger.info(`Pregunta frecuente eliminada: id=${id}`);

    return { message: 'Pregunta eliminada exitosamente.' };
  }
}

module.exports = DeleteFaqItem;
