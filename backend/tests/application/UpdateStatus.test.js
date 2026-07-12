const UpdateStatus = require('../../src/application/incidents/UpdateStatus');

const buildIncident = (overrides = {}) => ({
  id: 1,
  status: 'open',
  createdBy: 10,
  ticket: 'INC-2026-0001',
  ...overrides,
});

describe('UpdateStatus', () => {
  let incidentRepo;
  let logger;
  let updateStatus;

  beforeEach(() => {
    jest.clearAllMocks();
    incidentRepo = {
      findById: jest.fn(),
      updateStatus: jest.fn(),
      saveHistory: jest.fn().mockResolvedValue(undefined),
    };
    logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    updateStatus = new UpdateStatus(incidentRepo, logger);
  });

  test('throws INCIDENT_NOT_FOUND when incident does not exist', async () => {
    incidentRepo.findById.mockResolvedValue(null);

    await expect(
      updateStatus.execute({ id: 1, newStatus: 'in_progress', changedBy: 10, note: 'note' })
    ).rejects.toThrow('Incidencia no encontrada');
  });

  test('throws INVALID_TRANSITION on open → resolved', async () => {
    incidentRepo.findById.mockResolvedValue(buildIncident({ status: 'open' }));

    await expect(
      updateStatus.execute({ id: 1, newStatus: 'resolved', changedBy: 10, note: 'note' })
    ).rejects.toThrow('Transición inválida: no se puede pasar de open a resolved');
  });

  test('throws INVALID_TRANSITION on resolved → open', async () => {
    incidentRepo.findById.mockResolvedValue(buildIncident({ status: 'resolved' }));

    await expect(
      updateStatus.execute({ id: 1, newStatus: 'open', changedBy: 10, note: 'note' })
    ).rejects.toThrow('Transición inválida: no se puede pasar de resolved a open');
  });

  test('throws INVALID_TRANSITION on cancelled → in_progress', async () => {
    incidentRepo.findById.mockResolvedValue(buildIncident({ status: 'cancelled' }));

    await expect(
      updateStatus.execute({ id: 1, newStatus: 'in_progress', changedBy: 10, note: 'note' })
    ).rejects.toThrow('Transición inválida: no se puede pasar de cancelled a in_progress');
  });

  test('calls updateStatus with new status', async () => {
    incidentRepo.findById.mockResolvedValue(buildIncident());
    incidentRepo.updateStatus.mockResolvedValue({ ...buildIncident(), toJSON: () => ({ id: 1, status: 'in_progress' }) });

    await updateStatus.execute({ id: 1, newStatus: 'in_progress', changedBy: 10, note: 'note' });

    expect(incidentRepo.updateStatus).toHaveBeenCalledWith(1, 'in_progress', 'note');
  });

  test('calls saveHistory with note', async () => {
    incidentRepo.findById.mockResolvedValue(buildIncident());
    incidentRepo.updateStatus.mockResolvedValue({ ...buildIncident(), toJSON: () => ({ id: 1, status: 'in_progress' }) });

    await updateStatus.execute({ id: 1, newStatus: 'in_progress', changedBy: 10, note: 'note' });

    expect(incidentRepo.saveHistory).toHaveBeenCalledWith(1, 'in_progress', 10, 'note');
  });

  test('calls notificationService.notify when provided', async () => {
    incidentRepo.findById.mockResolvedValue(buildIncident());
    incidentRepo.updateStatus.mockResolvedValue({
      id: 1,
      createdBy: 10,
      ticket: 'INC-2026-0001',
      toJSON: () => ({ id: 1, status: 'in_progress' }),
    });
    const notificationService = { notify: jest.fn().mockResolvedValue(undefined) };
    updateStatus = new UpdateStatus(incidentRepo, logger, notificationService);

    await updateStatus.execute({ id: 1, newStatus: 'in_progress', changedBy: 10, note: 'note' });

    expect(notificationService.notify).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 10, incidentId: 1, type: 'status_updated' })
    );
  });

  test('does not throw when notificationService is undefined', async () => {
    incidentRepo.findById.mockResolvedValue(buildIncident());
    incidentRepo.updateStatus.mockResolvedValue({ ...buildIncident(), toJSON: () => ({ id: 1, status: 'in_progress' }) });

    await expect(
      updateStatus.execute({ id: 1, newStatus: 'in_progress', changedBy: 10, note: 'note' })
    ).resolves.toEqual({ id: 1, status: 'in_progress' });
  });
});
