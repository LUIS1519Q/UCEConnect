import { Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

import { useAuthStore } from "../store/authStore";
import { isMobileApp } from "../utils/plataform";
import type { Role } from "../types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to={ROUTES.auth.login} replace />;
  }

  if (isMobileApp() && user.role !== "student") {
    return <Navigate to={ROUTES.auth.login} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.auth.login} replace />;
  }

  return children;
}

export default ProtectedRoute;