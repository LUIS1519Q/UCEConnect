class IHelpItemRepo {
  async findAll() { throw new Error('Not implemented') }
  async findById(id) { throw new Error('Not implemented') }
  async create(item) { throw new Error('Not implemented') }
  async update(id, { question, answer, order }) { throw new Error('Not implemented') }
  async delete(id) { throw new Error('Not implemented') }
}

module.exports = IHelpItemRepo;
