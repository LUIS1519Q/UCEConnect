const OpenAI = require('openai');
const IClassifier = require('../../domain/incidents/IClassifier');

class GeminiClassifier extends IClassifier {
  constructor(apiKey) {
    super();
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });
  }

  async classify(title, description) {
    const response = await this.client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'google/gemini-flash-1.5',
      messages: [
        {
          role: 'system',
          content: 'Eres un clasificador de incidencias universitarias UCEConnect. Responde SOLO con JSON válido, sin markdown, sin texto extra.'
        },
        {
          role: 'user',
          content: `Clasifica esta incidencia universitaria:
Título: ${title}
Descripción: ${description}

Responde EXACTAMENTE con este JSON:
{
  "priority": "low|medium|high|critical",
  "summary": "resumen en máximo 100 caracteres",
  "category": "Académico|Administrativo|Infraestructura|Bienestar|null"
}`
        }
      ],
      max_tokens: 150,
      temperature: 0,
    });

    const text = response.choices[0].message.content.trim();
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }
}

module.exports = GeminiClassifier;
