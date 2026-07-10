const User = require('../../src/domain/users/User');

const buildUser = (overrides = {}) =>
  new User({
    id: 1,
    firstName: 'Ana',
    lastName: 'Perez',
    email: 'ana.perez@uce.edu.ec',
    passwordHash: 'super-secret-hash',
    roleId: 1,
    isActive: true,
    isVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    phone: '0999999999',
    facultyId: 2,
    careerId: 3,
    avatarUrl: 'https://example.com/avatar.png',
    facultyName: 'Ingenieria',
    careerName: 'Software',
    roleName: 'student',
    ...overrides,
  });

describe('User', () => {
  test('toJSON does not expose passwordHash', () => {
    const user = buildUser();
    expect(user.toJSON()).not.toHaveProperty('passwordHash');
  });

  test('toJSON returns firstName, lastName, email, roleId and roleName', () => {
    const user = buildUser();
    const json = user.toJSON();
    expect(json.firstName).toBe('Ana');
    expect(json.lastName).toBe('Perez');
    expect(json.email).toBe('ana.perez@uce.edu.ec');
    expect(json.roleId).toBe(1);
    expect(json.roleName).toBe('student');
  });

  test('toJSON returns avatarUrl, phone, facultyId, careerId', () => {
    const user = buildUser();
    const json = user.toJSON();
    expect(json.avatarUrl).toBe('https://example.com/avatar.png');
    expect(json.phone).toBe('0999999999');
    expect(json.facultyId).toBe(2);
    expect(json.careerId).toBe(3);
  });
});
