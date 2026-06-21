require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const RegisterUser = require('../../../application/users/RegisterUser');
const VerifyCode = require('../../../application/users/VerifyCode');
const LoginUser = require('../../../application/users/LoginUser');
const ResendVerifyCode = require('../../../application/users/ResendVerifyCode');
const ForgotPassword = require('../../../application/users/ForgotPassword');
const ResetPassword = require('../../../application/users/ResetPassword');
const LoginWithMicrosoft = require('../../../application/users/LoginWithMicrosoft');

const PostgresUserRepo = require('../../repositories/PostgresUserRepo');
const NodemailerEmailNotifier = require('../../services/NodemailerEmailNotifier');
const MicrosoftAuthService = require('../../services/MicrosoftAuthService');
const db = require('../../db/connection');
const logger = require('../../logger/logger');

const userRepo = new PostgresUserRepo(db);
const emailNotifier = new NodemailerEmailNotifier(process.env.EMAIL_USER, process.env.EMAIL_PASS);

const registerUser = new RegisterUser(userRepo, emailNotifier, bcrypt);
const verifyCode = new VerifyCode(userRepo);
const loginUser = new LoginUser(userRepo, bcrypt, jwt, process.env.JWT_SECRET, process.env.JWT_REFRESH_SECRET);
const resendVerifyCode = new ResendVerifyCode(userRepo, emailNotifier);
const forgotPassword = new ForgotPassword(userRepo, emailNotifier);
const resetPassword = new ResetPassword(userRepo, bcrypt);
const microsoftAuthService = new MicrosoftAuthService();
const loginWithMicrosoft = new LoginWithMicrosoft(
  userRepo,
  microsoftAuthService,
  jwt,
  process.env.JWT_SECRET,
  process.env.JWT_REFRESH_SECRET,
  bcrypt
);

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
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('ya está verificada')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

async function forgotPasswordHandler(req, res) {
  try {
    const result = await forgotPassword.execute({ email: req.body.email });
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('desactivada')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

async function resetPasswordHandler(req, res) {
  try {
    const result = await resetPassword.execute({
      email: req.body.email,
      code: req.body.code,
      newPassword: req.body.newPassword,
    });
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (
      error.message.includes('expirado') ||
      error.message.includes('ya fue utilizado') ||
      error.message.includes('incorrecto')
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

async function microsoftLogin(req, res) {
  const authUrl = await microsoftAuthService.getAuthUrl();
  res.redirect(authUrl);
}

async function microsoftCallback(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: 'Código de autorización requerido' });
    }

    const result = await loginWithMicrosoft.execute({ code });

    res.status(200).json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
      isNewUser: result.isNewUser,
    });
  } catch (error) {
    logger.error(`Error en Microsoft callback: ${error.message}`);

    if (error.message.includes('@uce.edu.ec')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes('desactivada')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  register,
  verifyCode: verifyCodeHandler,
  login,
  resendCode,
  forgotPassword: forgotPasswordHandler,
  resetPassword: resetPasswordHandler,
  microsoftLogin,
  microsoftCallback,
};
