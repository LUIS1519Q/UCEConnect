import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
}

function DashboardLayout({
  title,
  children,
}: DashboardLayoutProps) {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-blue-600 px-6 py-4 text-white">
        <h1 className="text-xl font-bold">
          UCEConnect
        </h1>

        <div className="flex items-center gap-4">
          <span>{user?.email}</span>

          <button
            onClick={handleLogout}
            className="rounded-md bg-red-500 px-4 py-2"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="mb-6 text-3xl font-bold">
          {title}
        </h2>

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;