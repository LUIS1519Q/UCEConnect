class ListIncidents {
  constructor(incidentRepo) {
    this.incidentRepo = incidentRepo;
  }

  async execute({ role, userId, status, categoryId, page = 1, limit = 10 }) {
    const effectiveUserId = role === 'student' ? userId : undefined;
    const safeLimit = Math.min(limit, 50);
    const safePage = Math.max(page, 1);

    const result = await this.incidentRepo.findAll({
      role,
      userId: effectiveUserId,
      status,
      categoryId,
      page: safePage,
      limit: safeLimit,
    });

    return {
      data: result.data.map((i) => i.toJSON()),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: result.total,
      },
    };
  }
}

module.exports = ListIncidents;
