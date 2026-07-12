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
    incidentFeedback: "/manager/incidents/:id/conversation",
    profile: "/manager/profile",
    notifications: "/manager/notifications",
  },

  admin: {
    dashboard: "/admin/dashboard",
    incidents: "/admin/incidents",
    incidentDetail: "/admin/incidents/:id",
    users: "/admin/users",
    categories: "/admin/categories",
    settings: "/admin/settings",
    notifications: "/admin/notifications",
    profile: "/admin/profile",
  },

} as const;