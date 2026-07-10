const GenerateMonthlyReport = require('../../../application/reports/GenerateMonthlyReport');
const PostgresIncidentRepo = require('../../repositories/PostgresIncidentRepo');
const GeminiReportSummarizer = require('../../services/GeminiReportSummarizer');
const pdfReportGenerator = require('../../services/PdfReportGenerator');
const excelReportGenerator = require('../../services/ExcelReportGenerator');
const db = require('../../db/connection');
const logger = require('../../logger/logger');

const incidentRepo = new PostgresIncidentRepo(db);
const reportSummarizer = new GeminiReportSummarizer(process.env.OPENROUTER_API_KEY);

async function getMonthlySummary(req, res) {
  try {
    const result = await new GenerateMonthlyReport(incidentRepo, reportSummarizer, logger).execute({
      month: req.query.month,
    });
    return res.status(200).json(result);
  } catch (err) {
    logger.error(`Error en getMonthlySummary: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function downloadPdf(req, res) {
  try {
    const report = await new GenerateMonthlyReport(incidentRepo, reportSummarizer, logger).execute({
      month: req.query.month,
    });
    const buffer = await pdfReportGenerator.generate(report);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="reporte-${report.month}.pdf"`);
    return res.status(200).send(buffer);
  } catch (err) {
    logger.error(`Error en downloadPdf: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function downloadExcel(req, res) {
  try {
    const report = await new GenerateMonthlyReport(incidentRepo, reportSummarizer, logger).execute({
      month: req.query.month,
    });
    const buffer = await excelReportGenerator.generate(report);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="reporte-${report.month}.xlsx"`);
    return res.status(200).send(buffer);
  } catch (err) {
    logger.error(`Error en downloadExcel: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

module.exports = { getMonthlySummary, downloadPdf, downloadExcel };
