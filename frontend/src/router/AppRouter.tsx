import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import StudentDashboard from "../pages/dashboard/StudentDashboard";
import ManagerDashboard from "../pages/dashboard/ManagerDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ProfilePage from "../pages/profile/ProfilePage";
import EditProfilePage from "../pages/profile/EditProfilePage";
import MyIncidentsPage from "../pages/student/MyIncidentsPage";
import CreateIncidentPage from "../pages/incidents/CreateIncidentPage";
import EditIncidentPage from "../pages/student/EditIncidentPage";
import IncidentDetailPage from "../pages/student/IncidentDetailPage";
import AISuggestionPage from "../pages/student/AISuggestionPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route
          path="/dashboard/estudiante"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incidents/create"
          element={
            <ProtectedRoute>
              <CreateIncidentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incidents"
          element={
            <ProtectedRoute>
              <MyIncidentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incidents/:id"
          element={
            <ProtectedRoute>
              <IncidentDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incidents/edit"
          element={
            <ProtectedRoute>
              <EditIncidentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incidents/ai-suggestion"
          element={
            <ProtectedRoute>
              <AISuggestionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/gestor"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;