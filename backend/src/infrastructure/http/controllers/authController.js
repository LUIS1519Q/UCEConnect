// authController.js — Adaptador de infraestructura: controlador HTTP de autenticación
// Conecta las rutas de Express con los casos de uso de aplicación, traduciendo
// peticiones/respuestas HTTP hacia/desde el dominio. No contiene lógica de negocio.

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const RegisterUser = require('../../../application/users/RegisterUser');
const VerifyCode = require('../../../application/users/VerifyCode');
const LoginUser = require('../../../application/users/LoginUser');

const PostgresUserRepo = require('../../repositories/PostgresUserRepo');
const NodemailerEmailNotifier = require('../../services/NodemailerEmailNotifier');
const db = require('../../db/connection');

// Adaptadores y casos de uso se instancian una sola vez y se reutilizan entre peticiones
const userRepo = new PostgresUserRepo(db);
const emailNotifier = new NodemailerEmailNotifier(process.env.EMAIL_USER, process.env.EMAIL_PASS);

const registerUser = new RegisterUser(userRepo, emailNotifier, bcrypt);
const verifyCode = new VerifyCode(userRepo);
const loginUser = new LoginUser(userRepo, bcrypt, jwt, process.env.JWT_SECRET, process.env.JWT_REFRESH_SECRET);

// Mensajes de negoción que corresponden a errores de validación del cliente (400)
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

module.exports = {
  register,
  verifyCode: verifyCodeHandler,
  login,
};
