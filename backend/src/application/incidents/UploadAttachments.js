const Attachment = require('../../domain/incidents/Attachment');

class UploadAttachments {
  constructor(incidentRepo, attachmentRepo, cloudinaryService, attachmentPolicy, logger) {
    this.incidentRepo = incidentRepo;
    this.attachmentRepo = attachmentRepo;
    this.cloudinaryService = cloudinaryService;
    this.attachmentPolicy = attachmentPolicy;
    this.logger = logger;
  }

  async execute({ incidentId, userId, role, files }) {
    const incident = await this.incidentRepo.findById(incidentId);
    if (!incident) {
      throw new Error('Incident not found');
    }

    if (role === 'student') {
      if (incident.createdBy !== userId) {
        throw new Error('You do not have permission to attach files to this incident');
      }
      if (incident.status !== 'open') {
        throw new Error('Files can only be attached to incidents in open status');
      }
    }

    if (!files || files.length === 0) {
      throw new Error('At least one file is required');
    }

    if (files.length > this.attachmentPolicy.maxFilesPerUpload) {
      throw new Error('The maximum number of allowed files was exceeded');
    }

    for (const file of files) {
      const category = this.attachmentPolicy.resolveCategory(file.mimetype);
      if (!category) {
        throw new Error(`File type not allowed: ${file.mimetype}`);
      }
      if (file.size > this.attachmentPolicy.maxSizeForMimeType(file.mimetype)) {
        throw new Error(`File "${file.originalname}" exceeds the maximum allowed size`);
      }
    }

    const attachments = [];
    for (const file of files) {
      const category = this.attachmentPolicy.resolveCategory(file.mimetype);
      const resourceType = this.attachmentPolicy.resourceTypeForMimeType(file.mimetype);
      const cloudinaryUrl = await this.cloudinaryService.uploadAttachment(file.buffer, incidentId, resourceType);

      const saved = await this.attachmentRepo.save(
        new Attachment({
          incidentId,
          cloudinaryUrl,
          fileType: category,
          mimeType: file.mimetype,
          originalFilename: file.originalname,
          sizeBytes: file.size,
          uploadedBy: userId,
        })
      );
      attachments.push(saved);
    }

    this.logger.info(`Files attached: incidentId=${incidentId} count=${attachments.length}`);

    return attachments.map((attachment) => attachment.toJSON());
  }
}

module.exports = UploadAttachments;
