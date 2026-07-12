const GetNotifications = require('../../src/application/notifications/GetNotifications');

describe('GetNotifications', () => {
  let notificationRepo;
  let logger;
  let getNotifications;

  beforeEach(() => {
    jest.clearAllMocks();
    notificationRepo = { findByUserId: jest.fn() };
    logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    getNotifications = new GetNotifications(notificationRepo, logger);
  });

  test('calls findByUserId with correct userId', async () => {
    notificationRepo.findByUserId.mockResolvedValue({ data: [], pagination: { page: 1, limit: 10, total: 0 } });

    await getNotifications.execute({ userId: 10, page: 1, limit: 10, unread: false });

    expect(notificationRepo.findByUserId).toHaveBeenCalledWith(10, expect.any(Object));
  });

  test('passes page, limit, unread to repo', async () => {
    notificationRepo.findByUserId.mockResolvedValue({ data: [], pagination: { page: 2, limit: 5, total: 0 } });

    await getNotifications.execute({ userId: 10, page: 2, limit: 5, unread: true });

    expect(notificationRepo.findByUserId).toHaveBeenCalledWith(10, { page: 2, limit: 5, unread: true });
  });

  test('returns paginated result', async () => {
    const paginated = { data: [{ id: 1 }], pagination: { page: 1, limit: 10, total: 1 } };
    notificationRepo.findByUserId.mockResolvedValue(paginated);

    const result = await getNotifications.execute({ userId: 10, page: 1, limit: 10, unread: false });

    expect(result).toEqual(paginated);
  });
});
