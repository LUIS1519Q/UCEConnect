class IInternalNoteRepo {
  async save(note) { throw new Error('Not implemented') }
  async findByIncidentId(incidentId) { throw new Error('Not implemented') }
}

module.exports = IInternalNoteRepo;
