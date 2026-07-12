class ListIncidents {
  constructor(incidentRepo) {
    this.incidentRepo = incidentRepo;
  }

  async execute({ role, userId, status, categoryId, page = 1, limit = 5 }) {
    if (role === 'student') {
      const { data } = await this.incidentRepo.findAll({
        createdBy: userId,
        status,
        categoryId,
        paginate: false,
      });
      return { data };
    }

    const result = await this.incidentRepo.findAll({
      status,
      categoryId,
      page: Number(page),
      limit: Number(limit),
      paginate: true,
    });
    return result;
  }
}

module.exports = ListIncidents;
