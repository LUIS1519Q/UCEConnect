class UpdateAvatar {
  constructor(userRepo, cloudinaryService, logger) {
    this.userRepo = userRepo;
    this.cloudinaryService = cloudinaryService;
    this.logger = logger;
  }

  async execute({ userId, fileBuffer, mimetype }) {
    if (!fileBuffer) {
      throw new Error('Avatar file is required.');
    }

    const avatarUrl = await this.cloudinaryService.uploadAvatar(fileBuffer, userId);

    await this.userRepo.updateAvatar(userId, avatarUrl);

    this.logger.info(`Avatar updated: userId=${userId}`);

    return { avatarUrl };
  }
}

module.exports = UpdateAvatar;
