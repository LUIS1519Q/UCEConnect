jest.mock('../../src/infrastructure/logger/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const CancelIncident = require('../../src/application/incidents/CancelIncident');

const buildIncident = (overrides = {}) => ({
  id: 1,
  createdBy: 10,
  status: 'open',
  ...overrides,
});

describe('CancelIncident', () => {
  let incidentRepo;
  let cancelIncident;

  beforeEach(() => {
    jest.clearAllMocks();
    incidentRepo = {
      findById: jest.fn(),
      updateStatus: jest.fn(),
      saveHistory: jest.fn().mockResolvedValue(undefined),
    };
    cancelIncident = new CancelIncident(incidentRepo);
  });

  test('throws INCIDENT_NOT_FOUND when incident does not exist', async () => {
    incidentRepo.findById.mockResolvedValue(null);

    await expect(cancelIncident.execute({ id: 1, userId: 10 })).rejects.toThrow(
      'Incident not found'
    );
  });

  test('throws INSUFFICIENT_PERMISSION when student is not owner', async () => {
    incidentRepo.findById.mockResolvedValue(buildIncident({ createdBy: 99 }));

    await expect(cancelIncident.execute({ id: 1, userId: 10 })).rejects.toThrow(
      'You do not have permission to cancel this incident'
    );
  });

  test('throws BUSINESS_RULE_VIOLATION when status is not open', async () => {
    incidentRepo.findById.mockResolvedValue(buildIncident({ status: 'resolved' }));

    await expect(cancelIncident.execute({ id: 1, userId: 10 })).rejects.toThrow(
      'Only incidents in open status can be cancelled'
    );
  });

  test('status changes to cancelled (not rejected)', async () => {
    incidentRepo.findById.mockResolvedValue(buildIncident());
    incidentRepo.updateStatus.mockResolvedValue({ toJSON: () => ({ id: 1, status: 'cancelled' }) });

    await cancelIncident.execute({ id: 1, userId: 10 });

    expect(incidentRepo.updateStatus).toHaveBeenCalledWith(1, 'cancelled');
  });

  test('calls saveHistory with cancelled note', async () => {
    incidentRepo.findById.mockResolvedValue(buildIncident());
    incidentRepo.updateStatus.mockResolvedValue({ toJSON: () => ({ id: 1, status: 'cancelled' }) });

    await cancelIncident.execute({ id: 1, userId: 10 });

    expect(incidentRepo.saveHistory).toHaveBeenCalledWith(1, 'cancelled', 10, 'Cancelled by student');
  });

  test('returns updated incident', async () => {
    incidentRepo.findById.mockResolvedValue(buildIncident());
    incidentRepo.updateStatus.mockResolvedValue({ toJSON: () => ({ id: 1, status: 'cancelled' }) });

    const result = await cancelIncident.execute({ id: 1, userId: 10 });

    expect(result).toEqual({ id: 1, status: 'cancelled' });
  });
});
