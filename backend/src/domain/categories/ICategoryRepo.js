class ICategoryRepo {
  async create(category) { throw new Error('Not implemented') }
  async findAll({ isActive }) { throw new Error('Not implemented') }
  async findById(id) { throw new Error('Not implemented') }
  async findByName(name) { throw new Error('Not implemented') }
  async update(id, { name, description, isActive }) { throw new Error('Not implemented') }
}

module.exports = ICategoryRepo;
