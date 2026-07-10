class Attachment {
  constructor({ id, incidentId, cloudinaryUrl, fileType, mimeType, originalFilename, sizeBytes, uploadedBy, uploadedByName, uploadedAt }) {
    this.id = id;
    this.incidentId = incidentId;
    this.cloudinaryUrl = cloudinaryUrl;
    this.fileType = fileType;
    this.mimeType = mimeType;
    this.originalFilename = originalFilename;
    this.sizeBytes = sizeBytes;
    this.uploadedBy = uploadedBy;
    this.uploadedByName = uploadedByName;
    this.uploadedAt = uploadedAt;
  }

  toJSON() {
    return {
      id: this.id,
      incidentId: this.incidentId,
      cloudinaryUrl: this.cloudinaryUrl,
      fileType: this.fileType,
      mimeType: this.mimeType,
      originalFilename: this.originalFilename,
      sizeBytes: this.sizeBytes,
      uploadedBy: this.uploadedBy,
      uploadedByName: this.uploadedByName,
      uploadedAt: this.uploadedAt,
    };
  }
}

module.exports = Attachment;
