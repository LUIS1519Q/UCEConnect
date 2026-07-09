const OpenAI = require('openai');
const IReportSummarizer = require('../../domain/reports/IReportSummarizer');

class GeminiReportSummarizer extends IReportSummarizer {
  constructor(apiKey) {
    super();
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });
  }

  async summarize({ month, metrics, categoryBreakdown }) {
    const categoryLines = categoryBreakdown.map((c) => `${c.category}: ${c.count}`).join(', ');

    const response = await this.client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'google/gemini-flash-1.5',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente que redacta resúmenes ejecutivos breves de reportes mensuales de incidencias universitarias. Responde solo con el texto del resumen, sin markdown, sin listas.',
        },
        {
          role: 'user',
          content: `Redacta un resumen ejecutivo (máximo 150 palabras) del siguiente reporte mensual de incidencias (${month}):
Total: ${metrics.total}
Abiertas: ${metrics.open}
En progreso: ${metrics.in_progress}
Resueltas: ${metrics.resolved}
Rechazadas: ${metrics.rejected}
Canceladas: ${metrics.cancelled}
Por categoría: ${categoryLines}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    return response.choices[0].message.content.trim();
  }
}

module.exports = GeminiReportSummarizer;
