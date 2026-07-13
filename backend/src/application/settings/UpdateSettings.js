class UpdateSettings {
  constructor(settingsRepo, logger) {
    this.settingsRepo = settingsRepo;
    this.logger = logger;
  }

  async execute({
    applicationName,
    contactEmail,
    maxFilesPerUpload,
    maxImageSizeBytes,
    maxDocumentSizeBytes,
    maxVideoSizeBytes,
    allowedImageTypes,
    allowedDocumentTypes,
    allowedVideoTypes,
  }) {
    const updated = await this.settingsRepo.updateSettings({
      applicationName,
      contactEmail,
      maxFilesPerUpload,
      maxImageSizeBytes,
      maxDocumentSizeBytes,
      maxVideoSizeBytes,
      allowedImageTypes,
      allowedDocumentTypes,
      allowedVideoTypes,
    });

    this.logger.info('Settings updated');

    return updated.toJSON();
  }
}

module.exports = UpdateSettings;
