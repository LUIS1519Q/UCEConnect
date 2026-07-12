const Category = require('../../domain/categories/Category');

class CreateCategory {
  constructor(categoryRepo, logger) {
    this.categoryRepo = categoryRepo;
    this.logger = logger;
  }

  async execute({ name, description }) {
    const existing = await this.categoryRepo.findByName(name);
    if (existing) {
      throw new Error('A category with that name already exists');
    }

    const category = await this.categoryRepo.create(
      new Category({ name, description: description || null, isActive: true })
    );

    this.logger.info(`Category created: ${name}`);

    return category.toJSON();
  }
}

module.exports = CreateCategory;
