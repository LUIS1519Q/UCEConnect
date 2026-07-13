class GetSettings {
  constructor(settingsRepo, logger) {
    this.settingsRepo = settingsRepo;
    this.logger = logger;
  }

  async execute() {
    const settings = await this.settingsRepo.findSettings();
    this.logger.info('Settings retrieved');
    return settings.toJSON();
  }
}

module.exports = GetSettings;
