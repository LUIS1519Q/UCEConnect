export const ROUTES = {
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    verifyCode: "/verify-code",
    resetPassword: "/reset-password",
  },

  dashboard: {
    student: "/dashboard/student",
    manager: "/dashboard/manager",
    admin: "/dashboard/admin",
  },
} as const;