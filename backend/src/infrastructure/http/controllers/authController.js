require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const RegisterUser = require('../../../application/users/RegisterUser');
const VerifyCode = require('../../../application/users/VerifyCode');
const LoginUser = require('../../../application/users/LoginUser');
const ResendVerifyCode = require('../../../application/users/ResendVerifyCode');
const ForgotPassword = require('../../../application/users/ForgotPassword');
const ResetPassword = require('../../../application/users/ResetPassword');
const VerifyResetCode = require('../../../application/users/VerifyResetCode');
const ResendResetCode = require('../../../application/users/ResendResetCode');
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
const resetPassword = new ResetPassword(userRepo, bcrypt, jwt, process.env.JWT_SECRET);
const verifyResetCode = new VerifyResetCode(userRepo);
const resendResetCode = new ResendResetCode(userRepo, emailNotifier);
const microsoftAuthService = new MicrosoftAuthService();
const loginWithMicrosoft = new LoginWithMicrosoft(
  userRepo,
  microsoftAuthService,
  jwt,
  process.env.JWT_SECRET,
  process.env.JWT_REFRESH_SECRET,
  bcrypt
);

async function register(req, res) {
  try {
    const user = await registerUser.execute(req.body);
    res.status(201).json({ message: 'Usuario registrado. Revisa tu correo para verificar tu cuenta.', user });
  } catch (error) {
    if (error.message.includes('already registered')) {
      return res.status(400).json({ message: error.message, errorCode: 'EMAIL_ALREADY_REGISTERED' });
    }
    if (error.message.includes('institutional')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

async function verifyCodeHandler(req, res) {
  try {
    const result = await verifyCode.execute(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message, errorCode: 'CODE_NOT_FOUND' });
    }
    if (error.message.includes('expired')) {
      return res.status(400).json({ message: error.message, errorCode: 'CODE_EXPIRED' });
    }
    if (error.message.includes('already been used')) {
      return res.status(400).json({ message: error.message, errorCode: 'CODE_ALREADY_USED' });
    }
    if (error.message.includes('Invalid verification')) {
      return res.status(400).json({ message: error.message, errorCode: 'INVALID_CODE' });
    }
    res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const result = await loginUser.execute(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('Invalid credentials')) {
      return res.status(401).json({ message: error.message, errorCode: 'INVALID_CREDENTIALS' });
    }
    if (error.message.includes('verify your email')) {
      return res.status(400).json({ message: error.message, errorCode: 'EMAIL_NOT_VERIFIED' });
    }
    if (error.message.includes('deactivated')) {
      return res.status(400).json({ message: error.message, errorCode: 'USER_DISABLED' });
    }
    res.status(500).json({ message: error.message });
  }
}

async function resendCode(req, res) {
  try {
    const result = await resendVerifyCode.execute(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('already verified')) {
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
    if (error.message.includes('User not found')) {
      return res.status(404).json({ message: error.message, errorCode: 'USER_NOT_FOUND' });
    }
    if (error.message.includes('deactivated')) {
      return res.status(400).json({ message: error.message, errorCode: 'USER_DISABLED' });
    }
    res.status(500).json({ message: error.message });
  }
}

async function verifyResetCodeHandler(req, res) {
  try {
    const result = await verifyResetCode.execute({ email: req.body.email, code: req.body.code });
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message, errorCode: 'CODE_NOT_FOUND' });
    }
    if (error.message.includes('expired')) {
      return res.status(400).json({ message: error.message, errorCode: 'CODE_EXPIRED' });
    }
    if (error.message.includes('already been used')) {
      return res.status(400).json({ message: error.message, errorCode: 'CODE_ALREADY_USED' });
    }
    if (error.message.includes('Invalid verification')) {
      return res.status(400).json({ message: error.message, errorCode: 'INVALID_CODE' });
    }
    res.status(500).json({ message: error.message });
  }
}

async function resendResetCodeHandler(req, res) {
  try {
    const result = await resendResetCode.execute({ email: req.body.email });
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('deactivated')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

async function resetPasswordHandler(req, res) {
  try {
    const result = await resetPassword.execute({
      resetToken: req.body.resetToken,
      newPassword: req.body.newPassword,
    });
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('Invalid or expired')) {
      return res.status(401).json({ message: error.message, errorCode: 'INVALID_RESET_TOKEN' });
    }
    if (error.message.includes('Invalid reset token')) {
      return res.status(401).json({ message: error.message, errorCode: 'INVALID_RESET_TOKEN' });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message, errorCode: 'USER_NOT_FOUND' });
    }
    if (error.message.includes('different from')) {
      return res.status(400).json({ message: error.message, errorCode: 'SAME_PASSWORD' });
    }
    res.status(500).json({ message: error.message });
  }
}

async function microsoftLogin(req, res) {
  try {
    const authUrl = await microsoftAuthService.getAuthUrl();
    res.redirect(authUrl);
  } catch (error) {
    logger.error(`Error en Microsoft login: ${error.message}`);
    res.status(500).json({ message: 'Error al iniciar sesión con Microsoft' });
  }
}

async function microsoftCallback(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: 'Código de autorización requerido' });
    }

    const result = await loginWithMicrosoft.execute({ code });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const params = new URLSearchParams({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      isNewUser: result.isNewUser.toString(),
    });
    res.redirect(`${frontendUrl}/auth/microsoft/callback?${params}`);
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
  verifyResetCodeHandler,
  resendResetCodeHandler,
  resetPassword: resetPasswordHandler,
  microsoftLogin,
  microsoftCallback,
};
