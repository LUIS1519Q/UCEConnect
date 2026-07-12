class ISettingsRepo {
  async findSettings() { throw new Error('Not implemented') }
  async updateSettings(data) { throw new Error('Not implemented') }
  async updateLogo(logoUrl) { throw new Error('Not implemented') }
}

module.exports = ISettingsRepo;
