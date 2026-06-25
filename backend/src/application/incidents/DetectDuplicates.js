class DetectDuplicates {
  constructor(incidentRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.logger = logger || { warn: () => {} };
  }

  async execute({ title, userId }) {
    const [openResult, inProgressResult] = await Promise.all([
      this.incidentRepo.findAll({ userId, status: 'open', page: 1, limit: 50 }),
      this.incidentRepo.findAll({ userId, status: 'in_progress', page: 1, limit: 50 }),
    ]);

    const active = [...openResult.data, ...inProgressResult.data];
    const newWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);

    const similar = active
      .filter(inc => {
        const existingWords = inc.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        if (newWords.length === 0 || existingWords.length === 0) return false;
        const matches = newWords.filter(w => existingWords.includes(w)).length;
        return matches / newWords.length > 0.6;
      })
      .map(inc => ({ id: inc.id, title: inc.title, status: inc.status }));

    if (similar.length > 0) {
      this.logger.warn(`Posible duplicado detectado para usuario ${userId}: IDs [${similar.map(s => s.id).join(', ')}]`);
    }

    return { isDuplicate: similar.length > 0, similar };
  }
}

module.exports = DetectDuplicates;
