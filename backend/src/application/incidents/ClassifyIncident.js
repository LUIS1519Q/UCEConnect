class ClassifyIncident {
  constructor(classifier, logger, categoryRepo) {
    this.classifier = classifier;
    this.logger = logger || { info: () => {}, warn: () => {}, error: () => {} };
    this.categoryRepo = categoryRepo || null;
  }

  async execute({ title, description }) {
    try {
      const categories = this.categoryRepo ? await this.categoryRepo.findAll({ isActive: true }) : [];
      const categoryNames = categories.map((category) => category.name);
      const result = await this.classifier.classify(title, description, categoryNames);
      this.logger.info(`Incident classified by Gemini: priority=${result.priority}, category=${result.category}`);
      return { ...result, aiClassified: true };
    } catch (err) {
      this.logger.warn(`Classification fallback activated: ${err.message}`);
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
