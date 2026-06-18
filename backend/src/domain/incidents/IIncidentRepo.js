class IIncidentRepo {
  create(incident) { throw new Error('Not implemented') }
  findById(id) { throw new Error('Not implemented') }
  findAll(filters) { throw new Error('Not implemented') }
  updateStatus(id, status) { throw new Error('Not implemented') }
  saveHistory(incidentId, status, changedBy, note) { throw new Error('Not implemented') }
  findHistoryByIncidentId(incidentId) { throw new Error('Not implemented') }
  categoryExists(categoryId) { throw new Error('Not implemented') }
}
module.exports = IIncidentRepo
