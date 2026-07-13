class UpdateCategory {
  constructor(categoryRepo, logger) {
    this.categoryRepo = categoryRepo;
    this.logger = logger;
  }

  async execute({ id, name, description, isActive }) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    if (name !== undefined && name !== category.name) {
      const existing = await this.categoryRepo.findByName(name);
      if (existing) {
        throw new Error('A category with that name already exists');
      }
    }

    const updated = await this.categoryRepo.update(id, { name, description, isActive });

    this.logger.info(`Category updated: id=${id}`);

    return updated.toJSON();
  }
}

module.exports = UpdateCategory;
