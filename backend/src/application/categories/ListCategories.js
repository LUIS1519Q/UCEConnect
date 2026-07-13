class ListCategories {
  constructor(categoryRepo, logger) {
    this.categoryRepo = categoryRepo;
    this.logger = logger;
  }

  async execute({ isActive } = {}) {
    const categories = await this.categoryRepo.findAll({ isActive });

    this.logger.info('Categories listed');

    return categories.map((category) => category.toJSON());
  }
}

module.exports = ListCategories;
