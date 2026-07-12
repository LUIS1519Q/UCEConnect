class GetFaculties {
  constructor(userRepo, logger) {
    this.userRepo = userRepo;
    this.logger = logger;
  }

  async execute() {
    const faculties = await this.userRepo.findFaculties();
    this.logger.info('Facultades obtenidas');
    return faculties;
  }
}

module.exports = GetFaculties;
