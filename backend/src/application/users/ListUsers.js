class ListUsers {
  constructor(userRepo, logger) {
    this.userRepo = userRepo;
    this.logger = logger;
  }

  async execute({ role, isActive, search, page = 1, limit = 10 }) {
    const safeLimit = Math.min(limit, 50);
    const safePage = Math.max(page, 1);

    const result = await this.userRepo.findAllUsers({
      role,
      isActive,
      search,
      page: safePage,
      limit: safeLimit,
    });

    this.logger.info('Usuarios listados por admin');

    return {
      data: result.data.map((user) => user.toJSON()),
      pagination: { page: safePage, limit: safeLimit, total: result.total },
    };
  }
}

module.exports = ListUsers;
