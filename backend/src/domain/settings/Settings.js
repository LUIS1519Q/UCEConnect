class Settings {
  constructor({
    id,
    applicationName,
    version,
    description,
    institution,
    contactEmail,
    contactWebsite,
    developedBy,
    copyright,
    logoUrl,
    maxFilesPerUpload,
    maxImageSizeBytes,
    maxDocumentSizeBytes,
    maxVideoSizeBytes,
    allowedImageTypes,
    allowedDocumentTypes,
    allowedVideoTypes,
    updatedAt,
  }) {
    this.id = id;
    this.applicationName = applicationName || null;
    this.version = version || null;
    this.description = description || null;
    this.institution = institution || null;
    this.contactEmail = contactEmail || null;
    this.contactWebsite = contactWebsite || null;
    this.developedBy = developedBy || null;
    this.copyright = copyright || null;
    this.logoUrl = logoUrl || null;
    this.maxFilesPerUpload = maxFilesPerUpload;
    this.maxImageSizeBytes = maxImageSizeBytes;
    this.maxDocumentSizeBytes = maxDocumentSizeBytes;
    this.maxVideoSizeBytes = maxVideoSizeBytes;
    this.allowedImageTypes = allowedImageTypes || [];
    this.allowedDocumentTypes = allowedDocumentTypes || [];
    this.allowedVideoTypes = allowedVideoTypes || [];
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      applicationName: this.applicationName,
      version: this.version,
      description: this.description,
      institution: this.institution,
      contactEmail: this.contactEmail,
      contactWebsite: this.contactWebsite,
      developedBy: this.developedBy,
      copyright: this.copyright,
      logoUrl: this.logoUrl,
      maxFilesPerUpload: this.maxFilesPerUpload,
      maxImageSizeBytes: this.maxImageSizeBytes,
      maxDocumentSizeBytes: this.maxDocumentSizeBytes,
      maxVideoSizeBytes: this.maxVideoSizeBytes,
      allowedImageTypes: this.allowedImageTypes,
      allowedDocumentTypes: this.allowedDocumentTypes,
      allowedVideoTypes: this.allowedVideoTypes,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Settings;
