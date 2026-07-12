import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { Button } from "../../components/ui/atoms/Button";
import { SearchBar } from "../../components/ui/molecules/SearchBar";
import { Pagination } from "../../components/ui/molecules/Pagination";
import { Modal } from "../../components/ui/organisms/Modal";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";
import { EmptyState } from "../../components/ui/organisms/EmptyState";
import { PasswordInput } from "../../components/ui/molecules/PasswordInput";

import { useAdminUsers } from "../../hooks/useAdminUser";
import { useCreateUser } from "../../hooks/useCreateUser";
import { useManageUser } from "../../hooks/useManageUser";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";

import {
  LayoutDashboard, FileText, Users, Tags, Settings, User, LogOut, Pencil, Trash2,
} from "../../components/ui/icons";

import { ROUTES } from "../../constants/routes";
import type { Role, AdminUser } from "../../types/user";

const ROLE_OPTIONS: { label: string; value: Role | "all" }[] = [
  { label: "Role", value: "all" },
  { label: "Student", value: "student" },
  { label: "Manager", value: "manager" },
  { label: "Admin", value: "admin" },
];

const ADMIN_SIDEBAR = (navigate: ReturnType<typeof useNavigate>, logout: () => void) => ({
  sidebarItems: [
    { label: "Dashboard", icon: LayoutDashboard, onClick: () => navigate(ROUTES.admin.dashboard) },
    { label: "Incidents", icon: FileText, onClick: () => navigate(ROUTES.admin.incidents) },
    { label: "Users", icon: Users, active: true, onClick: () => navigate(ROUTES.admin.users) },
    { label: "Categories", icon: Tags, onClick: () => navigate(ROUTES.admin.categories) },
    { label: "Settings", icon: Settings, onClick: () => navigate(ROUTES.admin.settings) },
    { label: "Profile", icon: User, onClick: () => navigate(ROUTES.admin.profile) },
  ],
  bottomItems: [{ label: "Logout", icon: LogOut, onClick: logout }],
});

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useUnreadNotificationsCount();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    password: "", role: "student" as Role, isActive: true,
  });

  const {
    users, pagination, isLoading, isError, refetch,
    page, setPage, roleFilter, setRoleFilter, search, setSearch,
  } = useAdminUsers();

  const { createUserAsync, isPending: isCreating } = useCreateUser();
  const { manageUserAsync, isPending: isManaging } = useManageUser();

  const filteredUsers = users.filter((u: AdminUser) =>
    search
        ? `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
        : true
    );

  const handleCreate = async () => {
    await createUserAsync(form);
    setCreateModalOpen(false);
    setForm({ firstName: "", lastName: "", email: "", password: "", role: "student", isActive: true });
  };

  const handleManage = async () => {
    if (!selectedUser) return;
    await manageUserAsync({ id: selectedUser.id, data: { isActive: !selectedUser.isActive } });
    setManageModalOpen(false);
  };

  const { sidebarItems, bottomItems } = ADMIN_SIDEBAR(navigate, logout);

  return (
    <AppLayout
      title="Users"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
      onProfileClick={() => navigate(ROUTES.admin.profile)}
      onNotificationsClick={() => navigate(ROUTES.admin.notifications)}
      sidebarItems={sidebarItems}
      bottomItems={bottomItems}
    >
      {/* Create Modal */}
      <Modal
        open={createModalOpen}
        title={selectedUser ? "Edit user" : "Create user"}
        onClose={() => { setCreateModalOpen(false); setSelectedUser(null); }}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button disabled={isCreating} onClick={handleCreate}>
              {isCreating ? "Saving..." : "Save"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">First name</label>
              <input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                placeholder="First name" value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Last name</label>
              <input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                placeholder="Last name" value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              placeholder="email@uce.edu.ec" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {!selectedUser && (
            <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <PasswordInput
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
            </div>
            )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Role</label>
              <select className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                <option value="student">Student</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                value={form.isActive ? "active" : "inactive"}
                onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      <div className="mx-auto w-full max-w-6xl space-y-4">

        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48">
            <SearchBar
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value as Role | "all"); setPage(1); }}
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button onClick={() => {
            setSelectedUser(null);
            setForm({ firstName: "", lastName: "", email: "", password: "", role: "student", isActive: true });
            setCreateModalOpen(true);
            }}>
            Create user
        </Button>
        </div>

        {isLoading ? (
          <LoadingState title="Loading users..." />
        ) : isError ? (
          <ErrorState title="Failed to load users" description="Please try again." onRetry={refetch} />
        ) : filteredUsers.length === 0 ? (
          <EmptyState title="No users found" description="Try adjusting your filters." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Created</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((u: AdminUser) => (
                  <tr key={u.id} className="transition-colors hover:bg-background">
                    <td className="px-4 py-3 font-medium text-textPrimary">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-4 py-3 text-textSecondary">{u.email}</td>
                    <td className="px-4 py-3 capitalize text-textSecondary">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                        u.isActive
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-textSecondary">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                                <button
                                className="text-textSecondary hover:text-primary"
                                onClick={() => {
                                    setSelectedUser(u);
                                    setForm({
                                        firstName: u.firstName,
                                        lastName: u.lastName,
                                        email: u.email,
                                        password: "",
                                        role: u.role,
                                        isActive: u.isActive,
                                    });
                                    setCreateModalOpen(true);
                                    }}
                                >
                                <Pencil size={16} />
                                </button>
                                <button
                                className="text-textSecondary hover:text-danger"
                                onClick={() => { setSelectedUser(u); setManageModalOpen(true); }}
                                >
                                <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && (
          <div className="flex items-center justify-between text-sm text-textSecondary">
            <span>
              {((page - 1) * 5) + 1}–{Math.min(page * 5, pagination.total)} of {pagination.total}
            </span>
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages ?? Math.ceil(pagination.total / 5)}
              onPageChange={setPage}
            />
          </div>
        )}

      </div>

      {/* Manage Modal */}
      <Modal
        open={manageModalOpen}
        title="Manage user"
        onClose={() => setManageModalOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setManageModalOpen(false)}>Cancel</Button>
            <Button variant="danger" disabled={isManaging} onClick={handleManage}>
              {isManaging ? "Saving..." : selectedUser?.isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-textSecondary">
          {selectedUser?.isActive
            ? `Are you sure you want to deactivate ${selectedUser?.firstName} ${selectedUser?.lastName}?`
            : `Are you sure you want to activate ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
        </p>
      </Modal>
    </AppLayout>
  );
}