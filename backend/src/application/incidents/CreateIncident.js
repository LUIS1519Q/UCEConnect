const Incident = require('../../domain/incidents/Incident');

class CreateIncident {
  constructor(incidentRepo, classifyIncident, detectDuplicates, logger, notificationService = null, userRepo = null) {
    this.incidentRepo = incidentRepo;
    this.classifyIncident = classifyIncident || null;
    this.detectDuplicates = detectDuplicates || null;
    this.logger = logger || null;
    this.notificationService = notificationService;
    this.userRepo = userRepo;
  }

  async execute({ title, description, createdBy }) {
    let classificationResult = { priority: 'medium', summary: null, categoryId: null, aiClassified: false };
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

    let categoryId = null;
    if (classificationResult.category) {
      categoryId = await this.incidentRepo.findCategoryIdByName(classificationResult.category);
    }

    const incident = Incident.create({
      title,
      description,
      categoryId,
      createdBy,
      priority: classificationResult.priority,
      aiSummary: classificationResult.summary,
    });
    const saved = await this.incidentRepo.create(incident);
    await this.incidentRepo.saveHistory(saved.id, 'open', createdBy, 'Incidencia creada');

    if (this.notificationService) {
      await this.notificationService.notify({
        userId: createdBy,
        incidentId: saved.id,
        ticket: saved.ticket,
        type: 'incident_created',
        title: 'Your incident was created successfully.',
      });

      if (this.userRepo) {
        const managers = await this.userRepo.findByRole('manager');
        const admins = await this.userRepo.findByRole('admin');
        const staff = [...managers, ...admins];

        for (const user of staff) {
          await this.notificationService.notify({
            userId: user.id,
            incidentId: saved.id,
            ticket: saved.ticket,
            type: 'incident_created',
            title: `New incident reported: ${saved.title}`,
          });
        }
      }
    }

    return {
      ...saved.toJSON(),
      aiClassified: classificationResult.aiClassified || false,
      duplicateWarning: duplicateResult.isDuplicate || false,
      similarIncidents: duplicateResult.similar || [],
    };
  }
}

module.exports = CreateIncident;
