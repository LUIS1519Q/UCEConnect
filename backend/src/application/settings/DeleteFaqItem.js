class DeleteFaqItem {
  constructor(helpItemRepo, logger) {
    this.helpItemRepo = helpItemRepo;
    this.logger = logger;
  }

  async execute({ id }) {
    const item = await this.helpItemRepo.findById(id);
    if (!item) {
      throw new Error('FAQ item not found');
    }

    await this.helpItemRepo.delete(id);

    this.logger.info(`FAQ item deleted: id=${id}`);

    return { message: 'Question deleted successfully.' };
  }
}

module.exports = DeleteFaqItem;
