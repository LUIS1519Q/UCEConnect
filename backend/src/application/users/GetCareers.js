class GetCareers {
  constructor(userRepo, logger) {
    this.userRepo = userRepo;
    this.logger = logger;
  }

  async execute({ facultyId }) {
    if (!facultyId) {
      throw new Error('Faculty ID is required.');
    }
    const careers = await this.userRepo.findCareersByFaculty(facultyId);
    this.logger.info(`Carreras obtenidas: facultyId=${facultyId}`);
    return careers;
  }
}

module.exports = GetCareers;
