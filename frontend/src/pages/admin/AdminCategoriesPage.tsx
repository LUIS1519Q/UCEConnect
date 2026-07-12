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

import { useAdminCategories } from "../../hooks/useAdminCategories";
import { useCreateCategory } from "../../hooks/useCreateCategory";
import { useUpdateCategory } from "../../hooks/useUpdateCategory";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";

import { LayoutDashboard, FileText, Users, Tags, Settings, Bell, User, LogOut, Pencil } from "../../components/ui/icons";
import { ROUTES } from "../../constants/routes";
import type { Category } from "../../types/category";

export default function AdminCategoriesPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useUnreadNotificationsCount();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "", isActive: true });

  const { categories, pagination, isLoading, isError, refetch, page, setPage, search, setSearch } = useAdminCategories();
  const { createCategoryAsync, isPending: isCreating } = useCreateCategory();
  const { updateCategoryAsync, isPending: isUpdating } = useUpdateCategory();

  const isPending = isCreating || isUpdating;

  const handleSave = async () => {
    if (selectedCategory) {
      await updateCategoryAsync({ id: selectedCategory.id, data: form });
    } else {
      await createCategoryAsync(form);
    }
    setModalOpen(false);
    setSelectedCategory(null);
    setForm({ name: "", description: "", isActive: true });
  };

  return (
    <AppLayout
      title="Categories"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
      onProfileClick={() => navigate(ROUTES.admin.profile)}
      onNotificationsClick={() => navigate(ROUTES.admin.notifications)}
      sidebarItems={[
        { label: "Dashboard", icon: LayoutDashboard, onClick: () => navigate(ROUTES.admin.dashboard) },
        { label: "Incidents", icon: FileText, onClick: () => navigate(ROUTES.admin.incidents) },
        { label: "Users", icon: Users, onClick: () => navigate(ROUTES.admin.users) },
        { label: "Categories", icon: Tags, active: true, onClick: () => navigate(ROUTES.admin.categories) },
        { label: "Settings", icon: Settings, onClick: () => navigate(ROUTES.admin.settings) },
        { label: "Notifications", icon: Bell, onClick: () => navigate(ROUTES.admin.notifications) },
        { label: "Profile", icon: User, onClick: () => navigate(ROUTES.admin.profile) },
      ]}
      bottomItems={[{ label: "Logout", icon: LogOut, onClick: logout }]}
    >
      <Modal
        open={modalOpen}
        title={selectedCategory ? "Edit category" : "Create category"}
        onClose={() => { setModalOpen(false); setSelectedCategory(null); }}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setModalOpen(false); setSelectedCategory(null); }}>Cancel</Button>
            <Button disabled={isPending} onClick={handleSave}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Category name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Brief description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              value={form.isActive ? "active" : "inactive"}
              onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>

      <div className="mx-auto w-full max-w-6xl space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => {
            setSelectedCategory(null);
            setForm({ name: "", description: "", isActive: true });
            setModalOpen(true);
          }}>
            Create category
          </Button>
        </div>

        {isLoading ? (
          <LoadingState title="Loading categories..." />
        ) : isError ? (
          <ErrorState title="Failed to load categories" description="Please try again." onRetry={refetch} />
        ) : categories.length === 0 ? (
          <EmptyState title="No categories found" description="Try adjusting your search." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Description</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((c: Category) => (
                  <tr key={c.id} className="transition-colors hover:bg-background">
                    <td className="px-4 py-3 font-medium text-textPrimary">{c.name}</td>
                    <td className="px-4 py-3 text-textSecondary">{c.description}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                        c.isActive
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}>
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-textSecondary hover:text-primary"
                        onClick={() => {
                          setSelectedCategory(c);
                          setForm({ name: c.name, description: c.description, isActive: c.isActive });
                          setModalOpen(true);
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && (
          <div className="flex items-center justify-between text-sm text-textSecondary">
            <span>{((page - 1) * 5) + 1}–{Math.min(page * 5, pagination.total)} of {pagination.total}</span>
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages ?? Math.ceil(pagination.total / 5)}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}