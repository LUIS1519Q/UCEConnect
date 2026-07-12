class IObservationRepo {
  async save(observation) { throw new Error('Not implemented') }
  async findByIncidentId(incidentId) { throw new Error('Not implemented') }
}

module.exports = IObservationRepo;
