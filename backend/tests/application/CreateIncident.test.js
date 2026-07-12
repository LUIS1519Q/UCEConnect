const CreateIncident = require('../../src/application/incidents/CreateIncident');

describe('CreateIncident', () => {
  let incidentRepo;
  let classifyIncident;
  let detectDuplicates;
  let logger;
  let createIncident;

  const buildSaved = (overrides = {}) => ({
    id: 1,
    title: 'Titulo de prueba',
    createdBy: 10,
    ticket: 'INC-2026-0001',
    toJSON: () => ({ id: 1, title: 'Titulo de prueba', ticket: 'INC-2026-0001' }),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    incidentRepo = {
      findCategoryIdByName: jest.fn(),
      create: jest.fn().mockResolvedValue(buildSaved()),
      saveHistory: jest.fn().mockResolvedValue(undefined),
    };
    classifyIncident = { execute: jest.fn().mockResolvedValue({ priority: 'medium', summary: null, category: null, aiClassified: true }) };
    detectDuplicates = { execute: jest.fn().mockResolvedValue({ isDuplicate: false, similar: [] }) };
    logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    createIncident = new CreateIncident(incidentRepo, classifyIncident, detectDuplicates, logger);
  });

  test('calls classifyIncident with title and description', async () => {
    await createIncident.execute({ title: 'Titulo de prueba', description: 'Descripcion detallada', createdBy: 10 });

    expect(classifyIncident.execute).toHaveBeenCalledWith({
      title: 'Titulo de prueba',
      description: 'Descripcion detallada',
    });
  });

  test('calls detectDuplicates with userId and title', async () => {
    await createIncident.execute({ title: 'Titulo de prueba', description: 'Descripcion detallada', createdBy: 10 });

    expect(detectDuplicates.execute).toHaveBeenCalledWith({ title: 'Titulo de prueba', userId: 10 });
  });

  test('sets duplicateWarning true when duplicates found', async () => {
    detectDuplicates.execute.mockResolvedValue({ isDuplicate: true, similar: [{ id: 2 }] });

    const result = await createIncident.execute({
      title: 'Titulo de prueba',
      description: 'Descripcion detallada',
      createdBy: 10,
    });

    expect(result.duplicateWarning).toBe(true);
  });

  test('saves incident with aiClassified true when AI responds', async () => {
    classifyIncident.execute.mockResolvedValue({ priority: 'high', summary: 'resumen', category: null, aiClassified: true });

    const result = await createIncident.execute({
      title: 'Titulo de prueba',
      description: 'Descripcion detallada',
      createdBy: 10,
    });

    expect(result.aiClassified).toBe(true);
  });

  test('saves incident with aiClassified false on AI fallback', async () => {
    classifyIncident.execute.mockRejectedValue(new Error('AI unavailable'));

    const result = await createIncident.execute({
      title: 'Titulo de prueba',
      description: 'Descripcion detallada',
      createdBy: 10,
    });

    expect(result.aiClassified).toBe(false);
  });

  test('calls notificationService.notify when provided', async () => {
    const notificationService = { notify: jest.fn().mockResolvedValue(undefined) };
    createIncident = new CreateIncident(incidentRepo, classifyIncident, detectDuplicates, logger, notificationService);

    await createIncident.execute({ title: 'Titulo de prueba', description: 'Descripcion detallada', createdBy: 10 });

    expect(notificationService.notify).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 10, incidentId: 1, type: 'incident_created' })
    );
  });

  test('returns incident with ticket field in INC-YYYY-XXXX format', async () => {
    const result = await createIncident.execute({
      title: 'Titulo de prueba',
      description: 'Descripcion detallada',
      createdBy: 10,
    });

    expect(result.ticket).toMatch(/^INC-\d{4}-\d{4,}$/);
  });
});
