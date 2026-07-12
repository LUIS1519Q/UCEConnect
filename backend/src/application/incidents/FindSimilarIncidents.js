function extractWords(text) {
  return (text || '').toLowerCase().split(/\s+/).filter((word) => word.length > 3);
}

class FindSimilarIncidents {
  constructor(incidentRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.logger = logger;
  }

  async execute({ title, description }) {
    const [openResult, inProgressResult] = await Promise.all([
      this.incidentRepo.findAll({ status: 'open', page: 1, limit: 100, paginate: true }),
      this.incidentRepo.findAll({ status: 'in_progress', page: 1, limit: 100, paginate: true }),
    ]);
    const candidates = [...openResult.data, ...inProgressResult.data];

    const newWords = [...extractWords(title), ...extractWords(description)];

    const scored = candidates
      .map((incident) => {
        const existingWords = [...extractWords(incident.title), ...extractWords(incident.description)];
        if (newWords.length === 0 || existingWords.length === 0) return null;
        const matches = newWords.filter((word) => existingWords.includes(word)).length;
        const score = matches / newWords.length;
        return score > 0.6 ? { incident, score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    this.logger.info(`Similar incident search: ${scored.length} found`);

    return scored.map(({ incident }) => ({
      id: incident.id,
      ticket: incident.ticket,
      title: incident.title,
      description: incident.description,
      category: incident.categoryName,
      status: incident.status,
    }));
  }
}

module.exports = FindSimilarIncidents;
