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
const UpdateProfile = require('../../../application/users/UpdateProfile');
const UpdateAvatar = require('../../../application/users/UpdateAvatar');
const GetFaculties = require('../../../application/users/GetFaculties');
const GetCareers = require('../../../application/users/GetCareers');

const PostgresUserRepo = require('../../repositories/PostgresUserRepo');
const NodemailerEmailNotifier = require('../../services/NodemailerEmailNotifier');
const MicrosoftAuthService = require('../../services/MicrosoftAuthService');
const cloudinaryService = require('../../services/CloudinaryService');
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
const updateProfile = new UpdateProfile(userRepo, logger);
const updateAvatar = new UpdateAvatar(userRepo, cloudinaryService, logger);
const getFaculties = new GetFaculties(userRepo, logger);
const getCareers = new GetCareers(userRepo, logger);

async function register(req, res) {
  try {
    const user = await registerUser.execute(req.body);
    res.status(201).json({ message: 'User registered. Check your email to verify your account.', user });
  } catch (error) {
    logger.error(`Error in register: ${error.message}`);
    if (error.message.includes('already registered')) {
      return res.status(400).json({ message: error.message, errorCode: 'EMAIL_ALREADY_REGISTERED' });
    }
    if (error.message.includes('institutional')) {
      return res.status(400).json({ message: error.message, errorCode: 'INVALID_EMAIL_DOMAIN' });
    }
    res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function verifyCodeHandler(req, res) {
  try {
    const result = await verifyCode.execute(req.body);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error in verifyCode: ${error.message}`);
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
    res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function login(req, res) {
  try {
    const result = await loginUser.execute(req.body);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error in login: ${error.message}`);
    if (error.message.includes('Invalid credentials')) {
      return res.status(401).json({ message: error.message, errorCode: 'INVALID_CREDENTIALS' });
    }
    if (error.message.includes('verify your email')) {
      return res.status(403).json({ message: error.message, errorCode: 'EMAIL_NOT_VERIFIED' });
    }
    if (error.message.includes('deactivated')) {
      return res.status(403).json({ message: error.message, errorCode: 'USER_DISABLED' });
    }
    res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function getProfile(req, res) {
  try {
    const user = await userRepo.findById(req.user.id);
    return res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.roleName,
        phone: user.phone,
        faculty: user.facultyName,
        career: user.careerName,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    logger.error(`Error in getProfile: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function updateProfileHandler(req, res) {
  try {
    const { firstName, lastName, phone, facultyId, careerId } = req.body;
    const user = await updateProfile.execute({
      userId: req.user.id,
      firstName,
      lastName,
      phone,
      facultyId: facultyId ? Number(facultyId) : undefined,
      careerId: careerId ? Number(careerId) : undefined,
    });
    return res.status(200).json({
      message: 'Profile updated successfully.',
      user: user.toJSON(),
    });
  } catch (err) {
    logger.warn(`Error in updateProfile: ${err.message}`);
    if (
      err.message.includes('must contain')
      || err.message.includes('Invalid')
      || err.message.includes('does not exist')
      || err.message.includes('does not belong')
    )
      return res.status(400).json({ message: err.message, errorCode: 'VALIDATION_ERROR' });
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function updateAvatarHandler(req, res) {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'Avatar file is required.', errorCode: 'VALIDATION_ERROR' });
    const result = await updateAvatar.execute({
      userId: req.user.id,
      fileBuffer: req.file.buffer,
      mimetype: req.file.mimetype,
    });
    return res.status(200).json({
      message: 'Profile picture updated successfully.',
      avatarUrl: result.avatarUrl,
    });
  } catch (err) {
    logger.warn(`Error in updateAvatar: ${err.message}`);
    if (err.message.includes('allowed') || err.message.includes('required'))
      return res.status(400).json({ message: err.message, errorCode: 'VALIDATION_ERROR' });
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function getFacultiesHandler(req, res) {
  try {
    const data = await getFaculties.execute();
    return res.status(200).json({ data });
  } catch (err) {
    logger.error(`Error in getFaculties: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function getCareersHandler(req, res) {
  try {
    const { facultyId } = req.query;
    const data = await getCareers.execute({ facultyId: Number(facultyId) });
    return res.status(200).json({ data });
  } catch (err) {
    logger.warn(`Error in getCareers: ${err.message}`);
    if (err.message.includes('required') || err.message.includes('Invalid'))
      return res.status(400).json({ message: err.message, errorCode: 'VALIDATION_ERROR' });
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function resendCode(req, res) {
  try {
    const result = await resendVerifyCode.execute(req.body);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error in resendCode: ${error.message}`);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message, errorCode: 'USER_NOT_FOUND' });
    }
    if (error.message.includes('already verified')) {
      return res.status(400).json({ message: error.message, errorCode: 'ALREADY_VERIFIED' });
    }
    res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function forgotPasswordHandler(req, res) {
  try {
    const result = await forgotPassword.execute({ email: req.body.email });
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error in forgotPassword: ${error.message}`);
    if (error.message.includes('User not found')) {
      return res.status(404).json({ message: error.message, errorCode: 'USER_NOT_FOUND' });
    }
    if (error.message.includes('deactivated')) {
      return res.status(400).json({ message: error.message, errorCode: 'USER_DISABLED' });
    }
    res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function verifyResetCodeHandler(req, res) {
  try {
    const result = await verifyResetCode.execute({ email: req.body.email, code: req.body.code });
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error in verifyResetCode: ${error.message}`);
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
    res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function resendResetCodeHandler(req, res) {
  try {
    const result = await resendResetCode.execute({ email: req.body.email });
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error in resendResetCode: ${error.message}`);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message, errorCode: 'USER_NOT_FOUND' });
    }
    if (error.message.includes('deactivated')) {
      return res.status(400).json({ message: error.message, errorCode: 'USER_DISABLED' });
    }
    res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
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
    logger.error(`Error in resetPassword: ${error.message}`);
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
    res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function microsoftLogin(req, res) {
  try {
    const authUrl = await microsoftAuthService.getAuthUrl();
    res.redirect(authUrl);
  } catch (error) {
    logger.error(`Error in Microsoft login: ${error.message}`);
    res.status(500).json({ message: 'Error signing in with Microsoft', errorCode: 'MICROSOFT_AUTH_ERROR' });
  }
}

async function microsoftCallback(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: 'Authorization code required', errorCode: 'AUTH_CODE_REQUIRED' });
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
    logger.error(`Error in Microsoft callback: ${error.message}`);

    if (error.message.includes('@uce.edu.ec')) {
      return res.status(403).json({ message: error.message, errorCode: 'INVALID_EMAIL_DOMAIN' });
    }
    if (error.message.includes('disabled')) {
      return res.status(400).json({ message: error.message, errorCode: 'USER_DISABLED' });
    }
    res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
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
  getProfile,
  updateProfileHandler,
  updateAvatarHandler,
  getFacultiesHandler,
  getCareersHandler,
};
