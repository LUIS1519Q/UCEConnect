import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "../constants/routes";

import ProtectedRoute from "./ProtectedRoute";

import LandingPage from "../pages/public/LandingPage";

import AuthShowcase from "../pages/dev/AuthShowcase";
import StudentShowcase from "../pages/dev/StudentShowcase";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import MicrosoftCallbackPage from "../pages/auth/MicrosoftCallbackPage";
import VerifyEmailPage from "../pages/auth/VerifyCodePage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import MyIncidentsPage from "../pages/student/MyIncidentsPage";
import CreateIncidentPage from "../pages/student/CreateIncidentPage";
import EditIncidentPage from "../pages/student/EditIncidentPage";
import IncidentDetailPage from "../pages/student/IncidentDetailPage";
import RespondToManagerRequestPage from "../pages/student/RespondToManagerRequestPage";
import NotificationsPage from "../pages/student/NotificationPage";
import ProfilePage from "../pages/student/ProfilePage";
import HelpPage from "../pages/student/HelpPage";
import AboutPage from "../pages/student/AboutPage";

import ManagerDashboard from "../pages/manager/MangerDashboardPage";
import ManagerIncidentsPage from "../pages/manager/ManagerIncidentsPage";
import ManagerIncidentDetailPage from "../pages/manager/ManagerIncidentDetailPage";
import ManagerFeedbackPage from "../pages/manager/ManagerFeedbackPage";
import ManagerNotificationsPage from "../pages/manager/ManagerNotificationsPage";
import ManagerProfilePage from "../pages/manager/ManagerProfilePage";

import AdminDashboard from "../pages/admin/AdminDashboardPage";
import AdminIncidentsPage from "../pages/admin/AdminIncidentsPage";
import AdminIncidentDetailPage from "../pages/admin/AdminIncidentsDetailPage";
import AdminUsersPage from "../pages/admin/AdminUserPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
              <Navigate
                  to={ROUTES.public.home}
                  replace
              />
          }
        />

        <Route
          path={ROUTES.public.home}
          element={< LandingPage />}
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
          path={ROUTES.student.myIncidents}
          element={
            <ProtectedRoute>
              <MyIncidentsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path={ROUTES.student.createIncident}
          element={
            <ProtectedRoute>
              <CreateIncidentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.student.incidentDetail}
          element={
            <ProtectedRoute>
              <IncidentDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.student.editIncident}
          element={
            <ProtectedRoute>
              <EditIncidentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.student.incidentConversation}
          element={
            <ProtectedRoute>
              <RespondToManagerRequestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.student.notifications}
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.student.profile}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.student.about}
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.student.help}
          element={
            <ProtectedRoute>
              <HelpPage />
            </ProtectedRoute>
          }
        />

        {/*MANAGER*/}

        <Route
          path={ROUTES.manager.dashboard}
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.manager.incidents}
          element={
            <ProtectedRoute>
              <ManagerIncidentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.manager.incidentDetail}
          element={
            <ProtectedRoute>
              <ManagerIncidentDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.manager.incidentFeedback}
          element={
            <ProtectedRoute>
              <ManagerFeedbackPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.manager.notifications}
          element={
            <ProtectedRoute>
              <ManagerNotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.manager.profile}
          element={
            <ProtectedRoute>
              <ManagerProfilePage />
            </ProtectedRoute>
          }
        />

        {/*ADMIN*/}

        <Route
          path={ROUTES.admin.dashboard}
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.admin.incidents}
          element={
            <ProtectedRoute>
              <AdminIncidentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.admin.incidentDetail}
          element={
            <ProtectedRoute>
              <AdminIncidentDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.admin.users}
          element={
            <ProtectedRoute>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;