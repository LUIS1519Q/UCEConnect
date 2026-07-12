import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "../constants/routes";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import MicrosoftCallbackPage from "../pages/auth/MicrosoftCallbackPage";
import VerifyEmailPage from "../pages/auth/VerifyCodePage";
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
import ManagerIncidentsPage from "../pages/manager/ManagerIncidentsPage";
import ManagerIncidentDetailPage from "../pages/manager/ManagerIncidentDetailPage";

import AuthShowcase from "../pages/dev/AuthShowcase";
import StudentShowcase from "../pages/dev/StudentShowcase";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
              <Navigate
                  to={ROUTES.auth.login}
                  replace
              />
          }
        />

        {/*DESIGN*/}

        <Route
          path="/auth-show-case"
          element={< AuthShowcase />}
        />

        <Route
          path="/student-show-case"
          element={< StudentShowcase />}
        />

        {/*AUTH*/}

        <Route
          path={ROUTES.auth.login}
          element={<LoginPage />}
        />

        <Route
          path={ROUTES.auth.register}
          element={<RegisterPage />}
        />

        <Route
          path={ROUTES.auth.microsoftCallback}
          element={<MicrosoftCallbackPage />}
        />

        <Route
          path={ROUTES.auth.verifyCode}
          element={<VerifyEmailPage />}
        />

        <Route
          path={ROUTES.auth.forgotPassword}
          element={<ForgotPasswordPage />}
        />

        <Route
          path={ROUTES.auth.resetPassword}
          element={<ResetPasswordPage />}
        />

        {/*STUDENT*/}

        <Route
          path={ROUTES.dashboard.student}
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
          path="/incidents/:id/edit"
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

        {/*MANAGER*/}

        <Route
          path={ROUTES.dashboard.manager}
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/incidents"
          element={
            <ProtectedRoute>
              <ManagerIncidentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/incidents/:id"
          element={
            <ProtectedRoute>
              <ManagerIncidentDetailPage />
            </ProtectedRoute>
          }
        />

        {/*ADMIN*/}

        <Route
          path={ROUTES.dashboard.admin}
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