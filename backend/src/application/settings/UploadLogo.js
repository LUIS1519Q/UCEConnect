class UploadLogo {
  constructor(settingsRepo, cloudinaryService, logger) {
    this.settingsRepo = settingsRepo;
    this.cloudinaryService = cloudinaryService;
    this.logger = logger;
  }

  async execute({ fileBuffer }) {
    if (!fileBuffer) {
      throw new Error('Logo file is required.');
    }

    const logoUrl = await this.cloudinaryService.uploadLogo(fileBuffer);
    await this.settingsRepo.updateLogo(logoUrl);

    this.logger.info('Logo actualizado');

    return { logoUrl };
  }
}

module.exports = UploadLogo;
