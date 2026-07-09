export const API_ENDPOINTS = {
  auth: {
    base: "/api/v1/auth",

    login: "/api/v1/auth/login",
    register: "/api/v1/auth/register",

    me: "/api/v1/auth/me",

    forgotPassword: "/api/v1/auth/forgot-password",
    resetPassword: "/api/v1/auth/reset-password",

    verifyCode: "/api/v1/auth/verify-code",
    verifyResetCode: "/api/v1/auth/verify-reset-code",

    resendCode: "/api/v1/auth/resend-code",
    resendResetCode: "/api/v1/auth/resend-reset-code",

    microsoft: "/api/v1/auth/microsoft",
  },

  incidents: {
    base: "/api/v1/incidents",
  },

  categories: {
    base: "/api/v1/categories",
  },

  notifications: {
    base: "/api/v1/notifications",
  },

  conversations: {
    base: "/api/v1/conversations",
  },

  profile: {
    base: "/api/v1/profile",
  },
} as const;