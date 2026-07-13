class CreateFaqItem {
  constructor(helpItemRepo, logger) {
    this.helpItemRepo = helpItemRepo;
    this.logger = logger;
  }

  async execute({ question, answer, order }) {
    const item = await this.helpItemRepo.create({ question, answer, order });
    this.logger.info(`FAQ item created: id=${item.id}`);
    return item.toJSON();
  }
}

module.exports = CreateFaqItem;
