const Incident = require('../../domain/incidents/Incident');

class CreateIncident {
  constructor(incidentRepo, classifyIncident, detectDuplicates) {
    this.incidentRepo = incidentRepo;
    this.classifyIncident = classifyIncident || null;
    this.detectDuplicates = detectDuplicates || null;
  }

  async execute({ title, description, categoryId, createdBy }) {
    const exists = await this.incidentRepo.categoryExists(categoryId);
    if (!exists) {
      throw new Error('La categoría especificada no existe');
    }

    const incident = Incident.create({ title, description, categoryId, createdBy });
    const saved = await this.incidentRepo.create(incident);
    await this.incidentRepo.saveHistory(saved.id, 'open', createdBy, 'Incidencia creada');

    let classificationResult = { priority: 'medium', summary: null, aiClassified: false };
    let duplicateResult = { isDuplicate: false, similar: [] };

    if (this.classifyIncident) {
      try {
        const [classification, duplicates] = await Promise.all([
          this.classifyIncident.execute({ title, description }),
          this.detectDuplicates
            ? this.detectDuplicates.execute({ title, userId: createdBy })
            : Promise.resolve({ isDuplicate: false, similar: [] }),
        ]);
        classificationResult = classification;
        duplicateResult = duplicates;
      } catch (_err) {
      }
    }

    return {
      ...saved.toJSON(),
      priority: classificationResult.priority || 'medium',
      aiSummary: classificationResult.summary || null,
      aiClassified: classificationResult.aiClassified || false,
      duplicateWarning: duplicateResult.isDuplicate || false,
      similarIncidents: duplicateResult.similar || [],
    };
  }
}

module.exports = CreateIncident;
