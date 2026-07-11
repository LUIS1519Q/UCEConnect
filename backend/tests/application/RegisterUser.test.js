jest.mock('../../src/infrastructure/logger/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const RegisterUser = require('../../src/application/users/RegisterUser');

const validInput = {
  firstName: 'Ana',
  lastName: 'Perez',
  email: 'ana.perez@uce.edu.ec',
  password: 'plain-password',
};

describe('RegisterUser', () => {
  let userRepo;
  let emailNotifier;
  let bcrypt;
  let registerUser;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepo = {
      findByEmail: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue({ toJSON: () => ({ id: 1, ...validInput }) }),
      saveVerifyCode: jest.fn().mockResolvedValue(undefined),
    };
    emailNotifier = { sendVerificationCode: jest.fn().mockResolvedValue(undefined) };
    bcrypt = { hash: jest.fn().mockResolvedValue('hashed-password') };
    registerUser = new RegisterUser(userRepo, emailNotifier, bcrypt);
  });

  test('throws when email is already registered', async () => {
    userRepo.findByEmail.mockResolvedValue({ id: 1, email: validInput.email });

    await expect(registerUser.execute(validInput)).rejects.toThrow('Email is already registered.');
  });

  test('calls bcrypt.hash with password and 10 rounds', async () => {
    await registerUser.execute(validInput);

    expect(bcrypt.hash).toHaveBeenCalledWith(validInput.password, 10);
  });

  test('calls userRepo.save with firstName, lastName, email', async () => {
    await registerUser.execute(validInput);

    expect(userRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: validInput.firstName,
        lastName: validInput.lastName,
        email: validInput.email,
      })
    );
  });
});
