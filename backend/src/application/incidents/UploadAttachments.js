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
      throw new Error('Incidencia no encontrada');
    }

    if (role === 'student') {
      if (incident.createdBy !== userId) {
        throw new Error('No tienes permiso para adjuntar archivos a esta incidencia');
      }
      if (incident.status !== 'open') {
        throw new Error('Solo se pueden adjuntar archivos a incidencias en estado open');
      }
    }

    if (!files || files.length === 0) {
      throw new Error('Se requiere al menos un archivo');
    }

    for (const file of files) {
      const category = this.attachmentPolicy.resolveCategory(file.mimetype);
      if (!category) {
        throw new Error(`Tipo de archivo no permitido: ${file.mimetype}`);
      }
      if (file.size > this.attachmentPolicy.maxSizeForMimeType(file.mimetype)) {
        throw new Error(`El archivo "${file.originalname}" excede el tamaño máximo permitido`);
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

    this.logger.info(`Archivos adjuntados: incidentId=${incidentId} count=${attachments.length}`);

    return attachments.map((attachment) => attachment.toJSON());
  }
}

module.exports = UploadAttachments;
