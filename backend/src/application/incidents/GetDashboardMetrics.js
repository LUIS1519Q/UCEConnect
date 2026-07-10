const STATUSES = ['open', 'in_progress', 'resolved', 'rejected', 'cancelled'];

class GetDashboardMetrics {
  constructor(incidentRepo, logger) {
    this.incidentRepo = incidentRepo;
    this.logger = logger;
  }

  async execute({ days = 30 } = {}) {
    const [statusCounts, trend, recent] = await Promise.all([
      this.incidentRepo.countByStatus(),
      this.incidentRepo.countByDay(days),
      this.incidentRepo.findAll({ page: 1, limit: 10 }),
    ]);

    const metrics = STATUSES.reduce((acc, status) => {
      acc[status] = statusCounts[status] || 0;
      return acc;
    }, {});
    metrics.total = Object.values(metrics).reduce((sum, count) => sum + count, 0);

    this.logger.info('Métricas de dashboard obtenidas');

    return {
      metrics,
      trend,
      recentIncidents: recent.data.map((incident) => incident.toJSON()),
    };
  }
}

module.exports = GetDashboardMetrics;
