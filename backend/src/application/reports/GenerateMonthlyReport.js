const STATUSES = ['open', 'in_progress', 'resolved', 'rejected', 'cancelled'];

function currentMonthString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthRange(month) {
  const [year, monthNum] = month.split('-').map(Number);
  const startDate = new Date(Date.UTC(year, monthNum - 1, 1));
  const endDate = new Date(Date.UTC(year, monthNum, 1));
  return { startDate, endDate };
}

class GenerateMonthlyReport {
  constructor(incidentRepo, reportSummarizer, logger) {
    this.incidentRepo = incidentRepo;
    this.reportSummarizer = reportSummarizer;
    this.logger = logger;
  }

  async execute({ month } = {}) {
    const targetMonth = month || currentMonthString();
    const { startDate, endDate } = getMonthRange(targetMonth);

    const [statusCounts, categoryBreakdown] = await Promise.all([
      this.incidentRepo.countByStatusInRange(startDate, endDate),
      this.incidentRepo.countByCategoryInRange(startDate, endDate),
    ]);

    const metrics = STATUSES.reduce((acc, status) => {
      acc[status] = statusCounts[status] || 0;
      return acc;
    }, {});
    metrics.total = Object.values(metrics).reduce((sum, count) => sum + count, 0);

    let summaryText;
    try {
      summaryText = await this.reportSummarizer.summarize({ month: targetMonth, metrics, categoryBreakdown });
    } catch (err) {
      this.logger.warn(`Report summary fallback: ${err.message}`);
      summaryText = `In ${targetMonth}, ${metrics.total} incidents were recorded: ${metrics.open} open, ${metrics.in_progress} in progress, ${metrics.resolved} resolved, ${metrics.rejected} rejected, and ${metrics.cancelled} cancelled.`;
    }

    this.logger.info(`Monthly report generated: ${targetMonth}`);

    return { month: targetMonth, metrics, categoryBreakdown, summaryText };
  }
}

module.exports = GenerateMonthlyReport;
