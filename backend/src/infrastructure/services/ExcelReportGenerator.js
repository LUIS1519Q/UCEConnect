const ExcelJS = require('exceljs');

class ExcelReportGenerator {
  async generate({ month, metrics, categoryBreakdown, summaryText }) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Reporte ${month}`);

    sheet.addRow(['Reporte mensual de incidencias', month]);
    sheet.addRow([]);

    sheet.addRow(['Métrica', 'Cantidad']);
    Object.entries(metrics).forEach(([key, value]) => sheet.addRow([key, value]));
    sheet.addRow([]);

    sheet.addRow(['Categoría', 'Cantidad']);
    categoryBreakdown.forEach((c) => sheet.addRow([c.category, c.count]));
    sheet.addRow([]);

    sheet.addRow(['Resumen']);
    sheet.addRow([summaryText]);

    return workbook.xlsx.writeBuffer();
  }
}

module.exports = new ExcelReportGenerator();
