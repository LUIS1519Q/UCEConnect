const bcrypt = require('bcrypt');

const CreateUserByAdmin = require('../../../application/users/CreateUserByAdmin');
const ListUsers = require('../../../application/users/ListUsers');
const ManageUser = require('../../../application/users/ManageUser');
const ForgotPassword = require('../../../application/users/ForgotPassword');

const PostgresUserRepo = require('../../repositories/PostgresUserRepo');
const NodemailerEmailNotifier = require('../../services/NodemailerEmailNotifier');
const db = require('../../db/connection');
const logger = require('../../logger/logger');

const userRepo = new PostgresUserRepo(db);
const emailNotifier = new NodemailerEmailNotifier(process.env.EMAIL_USER, process.env.EMAIL_PASS);
const forgotPassword = new ForgotPassword(userRepo, emailNotifier);

async function createUser(req, res) {
  try {
    const user = await new CreateUserByAdmin(userRepo, forgotPassword, bcrypt, logger).execute({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
    });
    return res.status(201).json({
      message: 'User created successfully. An email was sent to set their password.',
      user,
    });
  } catch (err) {
    logger.warn(`Error in createUser: ${err.message}`);
    if (err.message.includes('already registered'))
      return res.status(400).json({ message: err.message, errorCode: 'EMAIL_ALREADY_REGISTERED' });
    if (err.message.includes('institutional'))
      return res.status(400).json({ message: err.message, errorCode: 'INVALID_EMAIL_DOMAIN' });
    if (err.message.includes('does not exist'))
      return res.status(400).json({ message: err.message, errorCode: 'VALIDATION_ERROR' });
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function list(req, res) {
  try {
    const result = await new ListUsers(userRepo, logger).execute({
      role: req.query.role,
      isActive: req.query.isActive,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    });
    return res.status(200).json(result);
  } catch (err) {
    logger.error(`Error in listUsers: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function manage(req, res) {
  try {
    const user = await new ManageUser(userRepo, logger).execute({
      id: Number(req.params.id),
      role: req.body.role,
      isActive: req.body.isActive,
    });
    return res.status(200).json({ message: 'User updated successfully', user: user.toJSON() });
  } catch (err) {
    logger.warn(`Error in manageUser: ${err.message}`);
    if (err.message.includes('not found'))
      return res.status(404).json({ message: err.message, errorCode: 'USER_NOT_FOUND' });
    if (err.message.includes('does not exist'))
      return res.status(400).json({ message: err.message, errorCode: 'VALIDATION_ERROR' });
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

module.exports = { createUser, list, manage };
