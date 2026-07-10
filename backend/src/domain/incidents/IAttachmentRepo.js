class IAttachmentRepo {
  async save(attachment) { throw new Error('Not implemented') }
  async findByIncidentId(incidentId) { throw new Error('Not implemented') }
}

module.exports = IAttachmentRepo;
