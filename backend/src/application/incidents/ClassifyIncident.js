class ClassifyIncident {
  constructor(classifier, logger) {
    this.classifier = classifier;
    this.logger = logger || { info: () => {}, warn: () => {}, error: () => {} };
  }

  async execute({ title, description }) {
    try {
      const result = await this.classifier.classify(title, description);
      this.logger.info(`Incidencia clasificada por Gemini: priority=${result.priority}, category=${result.category}`);
      return { ...result, aiClassified: true };
    } catch (err) {
      this.logger.warn(`Fallback de clasificación activado: ${err.message}`);
      const text = `${title} ${description}`.toLowerCase();
      let priority = 'low';
      if (['urgente', 'critico', 'bloqueado', 'no puedo'].some(k => text.includes(k))) {
        priority = 'critical';
      } else if (['importante', 'problema', 'error', 'falla'].some(k => text.includes(k))) {
        priority = 'high';
      } else if (['demora', 'retraso', 'lento'].some(k => text.includes(k))) {
        priority = 'medium';
      }
      return {
        priority,
        summary: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
        category: null,
        aiClassified: false,
      };
    }
  }
}

module.exports = ClassifyIncident;
