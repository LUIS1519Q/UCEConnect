const IncidentStatus = require('../../src/domain/incidents/IncidentStatus');

describe('IncidentStatus', () => {
  describe('valid transitions', () => {
    test('open -> in_progress', () => {
      const status = new IncidentStatus('open');
      expect(status.transitionTo('in_progress')).toBe('in_progress');
    });

    test('open -> rejected', () => {
      const status = new IncidentStatus('open');
      expect(status.transitionTo('rejected')).toBe('rejected');
    });

    test('open -> cancelled', () => {
      const status = new IncidentStatus('open');
      expect(status.transitionTo('cancelled')).toBe('cancelled');
    });

    test('in_progress -> resolved', () => {
      const status = new IncidentStatus('in_progress');
      expect(status.transitionTo('resolved')).toBe('resolved');
    });

    test('in_progress -> rejected', () => {
      const status = new IncidentStatus('in_progress');
      expect(status.transitionTo('rejected')).toBe('rejected');
    });
  });

  describe('invalid transitions', () => {
    test('resolved -> open throws error', () => {
      const status = new IncidentStatus('resolved');
      expect(() => status.transitionTo('open')).toThrow();
    });

    test('resolved -> in_progress throws error', () => {
      const status = new IncidentStatus('resolved');
      expect(() => status.transitionTo('in_progress')).toThrow();
    });

    test('rejected -> open throws error', () => {
      const status = new IncidentStatus('rejected');
      expect(() => status.transitionTo('open')).toThrow();
    });

    test('rejected -> in_progress throws error', () => {
      const status = new IncidentStatus('rejected');
      expect(() => status.transitionTo('in_progress')).toThrow();
    });

    test('cancelled -> open throws error', () => {
      const status = new IncidentStatus('cancelled');
      expect(() => status.transitionTo('open')).toThrow();
    });

    test('cancelled -> in_progress throws error', () => {
      const status = new IncidentStatus('cancelled');
      expect(() => status.transitionTo('in_progress')).toThrow();
    });

    test('in_progress -> open throws error', () => {
      const status = new IncidentStatus('in_progress');
      expect(() => status.transitionTo('open')).toThrow();
    });

    test('in_progress -> cancelled throws error', () => {
      const status = new IncidentStatus('in_progress');
      expect(() => status.transitionTo('cancelled')).toThrow();
    });
  });

  describe('valid statuses', () => {
    test('accepts: open, in_progress, resolved, rejected, cancelled', () => {
      ['open', 'in_progress', 'resolved', 'rejected', 'cancelled'].forEach((value) => {
        expect(() => new IncidentStatus(value)).not.toThrow();
      });
    });

    test('throws on invalid status', () => {
      expect(() => new IncidentStatus('not_a_status')).toThrow();
    });
  });
});
