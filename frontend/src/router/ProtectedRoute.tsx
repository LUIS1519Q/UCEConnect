import { Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to={ROUTES.auth.login} replace />;
  }

  return children;
}

export default ProtectedRoute;