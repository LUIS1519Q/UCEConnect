export const ROUTES = {
  public: {
    home: "/",
  },

  auth: {
    login: "/login",
    register: "/register",
    microsoftCallback: "/auth/microsoft/callback",
    forgotPassword: "/forgot-password",
    verifyCode: "/verify-code",
    resetPassword: "/reset-password",
  },

  student: {
    myIncidents: "/incidents",
    createIncident: "/incidents/create",
    incidentDetail: "/incidents/:id",
    editIncident: "/incidents/:id/edit",

    incidentConversation: "/incidents/:id/conversation",
    
    notifications: "/notifications",

    profile: "/profile",
    editProfile: "/profile/edit",

    about: "/about",
    help: "/help",
  },

  manager: {
    dashboard: "/manager/dashboard",
    incidents: "/manager/incidents",
    incidentDetail: "/manager/incidents/:id",
    profile: "/manager/profile",
    notifications: "/manager/notifications",
  },

  admin: {
    incidents: "/admin/incidents",
  },
} as const;