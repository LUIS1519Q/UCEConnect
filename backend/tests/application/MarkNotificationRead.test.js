const MarkNotificationRead = require('../../src/application/notifications/MarkNotificationRead');

const buildNotification = (overrides = {}) => ({
  id: 1,
  userId: 10,
  ...overrides,
});

describe('MarkNotificationRead', () => {
  let notificationRepo;
  let logger;
  let markNotificationRead;

  beforeEach(() => {
    jest.clearAllMocks();
    notificationRepo = {
      findById: jest.fn(),
      markAsRead: jest.fn().mockResolvedValue(undefined),
    };
    logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    markNotificationRead = new MarkNotificationRead(notificationRepo, logger);
  });

  test('throws NOTIFICATION_NOT_FOUND when notification does not exist', async () => {
    notificationRepo.findById.mockResolvedValue(null);

    await expect(markNotificationRead.execute({ id: 1, userId: 10 })).rejects.toThrow(
      'Notification not found.'
    );
  });

  test('throws INSUFFICIENT_PERMISSION when user is not owner', async () => {
    notificationRepo.findById.mockResolvedValue(buildNotification({ userId: 99 }));

    await expect(markNotificationRead.execute({ id: 1, userId: 10 })).rejects.toThrow(
      'You do not have permission to access this notification.'
    );
  });

  test('calls markAsRead with notification id', async () => {
    notificationRepo.findById.mockResolvedValue(buildNotification());

    await markNotificationRead.execute({ id: 1, userId: 10 });

    expect(notificationRepo.markAsRead).toHaveBeenCalledWith(1);
  });

  test('returns success message', async () => {
    notificationRepo.findById.mockResolvedValue(buildNotification());

    const result = await markNotificationRead.execute({ id: 1, userId: 10 });

    expect(result).toEqual({ message: 'Notification marked as read.' });
  });
});
