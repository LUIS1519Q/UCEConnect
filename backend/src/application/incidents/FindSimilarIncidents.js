function extractWords(text) {
  return (text || '').toLowerCase().split(/\s+/).filter((word) => word.length > 3);
}

class FindSimilarIncidents {
  constructor(incidentRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.logger = logger;
  }

  async execute({ title, description, userId }) {
    const candidates = await this.incidentRepo.findSimilar(userId);

    const newWords = [...extractWords(title), ...extractWords(description)];

    const scored = candidates
      .map((incident) => {
        const existingWords = extractWords(incident.title);
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
      title: incident.title,
      status: incident.status,
    }));
  }
}

module.exports = FindSimilarIncidents;
