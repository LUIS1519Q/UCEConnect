const PDFDocument = require('pdfkit');

class PdfReportGenerator {
  generate({ month, metrics, categoryBreakdown, summaryText }) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(18).text(`Reporte mensual de incidencias — ${month}`, { align: 'center' });
      doc.moveDown();

      doc.fontSize(14).text('Métricas', { underline: true });
      doc.fontSize(11);
      Object.entries(metrics).forEach(([key, value]) => doc.text(`${key}: ${value}`));
      doc.moveDown();

      doc.fontSize(14).text('Por categoría', { underline: true });
      doc.fontSize(11);
      if (categoryBreakdown.length === 0) {
        doc.text('Sin incidencias en el período.');
      } else {
        categoryBreakdown.forEach((c) => doc.text(`${c.category}: ${c.count}`));
      }
      doc.moveDown();

      doc.fontSize(14).text('Resumen', { underline: true });
      doc.fontSize(11).text(summaryText, { align: 'justify' });

      doc.end();
    });
  }
}

module.exports = new PdfReportGenerator();
