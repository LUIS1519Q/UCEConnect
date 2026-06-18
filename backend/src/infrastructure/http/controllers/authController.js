require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const RegisterUser = require('../../../application/users/RegisterUser');
const VerifyCode = require('../../../application/users/VerifyCode');
const LoginUser = require('../../../application/users/LoginUser');
const ResendVerifyCode = require('../../../application/users/ResendVerifyCode');

const PostgresUserRepo = require('../../repositories/PostgresUserRepo');
const NodemailerEmailNotifier = require('../../services/NodemailerEmailNotifier');
const db = require('../../db/connection');

const userRepo = new PostgresUserRepo(db);
const emailNotifier = new NodemailerEmailNotifier(process.env.EMAIL_USER, process.env.EMAIL_PASS);

const registerUser = new RegisterUser(userRepo, emailNotifier, bcrypt);
const verifyCode = new VerifyCode(userRepo);
const loginUser = new LoginUser(userRepo, bcrypt, jwt, process.env.JWT_SECRET, process.env.JWT_REFRESH_SECRET);
const resendVerifyCode = new ResendVerifyCode(userRepo, emailNotifier);

const VALIDATION_ERRORS = [
  'Solo se permiten correos institucionales @uce.edu.ec',
  'El correo ya está registrado',
];

async function register(req, res) {
  try {
    const user = await registerUser.execute(req.body);
    res.status(201).json({ message: 'Usuario registrado. Revisa tu correo para verificar tu cuenta.', user });
  } catch (error) {
    const status = VALIDATION_ERRORS.includes(error.message) ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
}

async function verifyCodeHandler(req, res) {
  try {
    const result = await verifyCode.execute(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const result = await loginUser.execute(req.body);
    res.status(200).json(result);
  } catch (error) {
    const status = error.message === 'Credenciales inválidas' ? 401 : 400;
    res.status(status).json({ message: error.message });
  }
}

async function resendCode(req, res) {
  try {
    const result = await resendVerifyCode.execute(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  register,
  verifyCode: verifyCodeHandler,
  login,
  resendCode,
};
