const IncidentStatus = require('./IncidentStatus');

class Incident {
  constructor({
    id,
    title,
    description,
    categoryId,
    priority,
    aiSummary,
    status,
    createdBy,
    assignedTo,
    createdAt,
    updatedAt,
    categoryName,
    createdByName,
    assignedToName,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.categoryId = categoryId;
    this.priority = priority;
    this.aiSummary = aiSummary;
    this.status = status;
    this.createdBy = createdBy;
    this.assignedTo = assignedTo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.categoryName = categoryName || null;
    this.createdByName = createdByName || null;
    this.assignedToName = assignedToName || null;
  }

  static create({ title, description, categoryId, createdBy }) {
    if (!IncidentStatus.isValid('open')) {
      throw new Error('Estado inicial inválido');
    }
    return new Incident({
      id: null,
      title,
      description,
      categoryId,
      priority: 'medium',
      aiSummary: null,
      status: 'open',
      createdBy,
      assignedTo: null,
      createdAt: null,
      updatedAt: null,
    });
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      priority: this.priority,
      aiSummary: this.aiSummary,
      status: this.status,
      createdBy: this.createdBy,
      createdByName: this.createdByName,
      assignedTo: this.assignedTo,
      assignedToName: this.assignedToName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Incident;
