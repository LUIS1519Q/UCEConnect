const Notification = require('../../src/domain/notifications/Notification');

const buildNotification = (overrides = {}) =>
  new Notification({
    id: 1,
    userId: 10,
    incidentId: 20,
    ticket: 'INC-2026-0001',
    type: 'incident_created',
    title: 'Your incident was created successfully.',
    read: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  });

describe('Notification', () => {
  describe('type', () => {
    test.each(['incident_created', 'status_updated', 'manager_request', 'student_reply'])(
      'accepts type: %s',
      (type) => {
        expect(() => buildNotification({ type })).not.toThrow();
        expect(buildNotification({ type }).type).toBe(type);
      }
    );
  });

  describe('toJSON', () => {
    test('returns id, incidentId, ticket, type, title, read and createdAt', () => {
      const notification = buildNotification();

      expect(notification.toJSON()).toEqual({
        id: 1,
        incidentId: 20,
        ticket: 'INC-2026-0001',
        type: 'incident_created',
        title: 'Your incident was created successfully.',
        read: false,
        createdAt: '2026-01-01T00:00:00.000Z',
      });
    });

    test('does not expose userId', () => {
      const notification = buildNotification();
      expect(notification.toJSON()).not.toHaveProperty('userId');
    });
  });
});
