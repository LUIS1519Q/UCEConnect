import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { Button } from "../../components/ui/atoms/Button";
import { Modal } from "../../components/ui/organisms/Modal";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { Tabs } from "../../components/ui/molecules/Tabs";

import { useSettings } from "../../hooks/useSettings";
import { useUpdateSettings } from "../../hooks/useUpdateSettings";
import { useAdminFAQ } from "../../hooks/useAdminFAQ";
import { useUploadLogo } from "../../hooks/useUploadLogo";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";

import { LayoutDashboard, FileText, Users, Tags, Settings, User, LogOut, Pencil, Trash2 } from "../../components/ui/icons";
import { ROUTES } from "../../constants/routes";
import type { FAQItem } from "../../types/settings";

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useUnreadNotificationsCount();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<"general" | "student">("general");
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });

  const [settingsForm, setSettingsForm] = useState({
    applicationName: "",
    contactEmail: "",
    maxFileSize: 10,
    allowedFileTypes: "",
  });

  const [hasSyncedSettings, setHasSyncedSettings] = useState(false);
  const { settings, isLoading } = useSettings();
  const { updateSettings, isPending: isSaving } = useUpdateSettings();
  const { faqItems, createFAQ, updateFAQ, deleteFAQ, isCreating, isUpdating } = useAdminFAQ();
  const { uploadLogo, isPending: isUploadingLogo } = useUploadLogo();

 if (settings && !hasSyncedSettings) {
   setHasSyncedSettings(true);
   setSettingsForm({
     applicationName: settings.applicationName,
     contactEmail: settings.contactEmail,
     maxFileSize: settings.maxFileSize,
     allowedFileTypes: settings.allowedFileTypes.join(", "),
   });
 }

  const handleSaveGeneral = async () => {
    await updateSettings({
      applicationName: settingsForm.applicationName,
      contactEmail: settingsForm.contactEmail,
      maxFileSize: settingsForm.maxFileSize,
      allowedFileTypes: settingsForm.allowedFileTypes.split(",").map((t) => t.trim()),
    });
  };

  const handleSaveFAQ = async () => {
    if (selectedFAQ) {
      await updateFAQ({ id: selectedFAQ.id, data: faqForm });
    } else {
      await createFAQ({ ...faqForm, order: faqItems.length + 1 });
    }
    setFaqModalOpen(false);
    setSelectedFAQ(null);
    setFaqForm({ question: "", answer: "" });
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadLogo(file);
  };

  return (
    <AppLayout
      title="Settings"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
      onProfileClick={() => navigate(ROUTES.admin.profile)}
      onNotificationsClick={() => navigate(ROUTES.admin.notifications)}
      sidebarItems={[
        { label: "Dashboard", icon: LayoutDashboard, onClick: () => navigate(ROUTES.admin.dashboard) },
        { label: "Incidents", icon: FileText, onClick: () => navigate(ROUTES.admin.incidents) },
        { label: "Users", icon: Users, onClick: () => navigate(ROUTES.admin.users) },
        { label: "Categories", icon: Tags, onClick: () => navigate(ROUTES.admin.categories) },
        { label: "Settings", icon: Settings, active: true, onClick: () => navigate(ROUTES.admin.settings) },
        { label: "Profile", icon: User, onClick: () => navigate(ROUTES.admin.profile) },
      ]}
      bottomItems={[{ label: "Logout", icon: LogOut, onClick: logout }]}
    >
      {/* FAQ Modal */}
      <Modal
        open={faqModalOpen}
        title={selectedFAQ ? "Edit question" : "Add question"}
        onClose={() => { setFaqModalOpen(false); setSelectedFAQ(null); }}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setFaqModalOpen(false); setSelectedFAQ(null); }}>Cancel</Button>
            <Button disabled={isCreating || isUpdating} onClick={handleSaveFAQ}>
              {isCreating || isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        }
      >
        <p className="mb-4 text-sm text-textSecondary">This will be visible to students in Help & FAQ</p>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Question</label>
            <input
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Write the question..."
              value={faqForm.question}
              onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Answer</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Write the answer..."
              value={faqForm.answer}
              onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Tabs
          value={tab}
          onChange={(v) => setTab(v as "general" | "student")}
          tabs={[
            { label: "General", value: "general" },
            { label: "Student content", value: "student" },
          ]}
        />

        {isLoading ? (
          <LoadingState title="Loading settings..." />
        ) : tab === "general" ? (
          <div className="rounded-xl bg-surface p-6 shadow-sm space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">App name</label>
              <input
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                value={settingsForm.applicationName}
                onChange={(e) => setSettingsForm({ ...settingsForm, applicationName: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Contact email</label>
              <input
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                value={settingsForm.contactEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Max file size (MB)</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  value={settingsForm.maxFileSize}
                  onChange={(e) => setSettingsForm({ ...settingsForm, maxFileSize: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Allowed file types</label>
                <input
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="pdf, jpg, png"
                  value={settingsForm.allowedFileTypes}
                  onChange={(e) => setSettingsForm({ ...settingsForm, allowedFileTypes: e.target.value })}
                />
              </div>
            </div>
            <Button disabled={isSaving} onClick={handleSaveGeneral}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Help & FAQ */}
            <div className="rounded-xl bg-surface p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Help & FAQ</h3>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedFAQ(null);
                    setFaqForm({ question: "", answer: "" });
                    setFaqModalOpen(true);
                  }}
                >
                  + Add question
                </Button>
              </div>

              <div className="space-y-3">
                {faqItems.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-textPrimary">{item.question}</p>
                        <p className="mt-1 text-sm text-textSecondary">{item.answer}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-textSecondary hover:text-primary"
                          onClick={() => {
                            setSelectedFAQ(item);
                            setFaqForm({ question: item.question, answer: item.answer });
                            setFaqModalOpen(true);
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="text-textSecondary hover:text-danger"
                          onClick={() => deleteFAQ(item.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About UCEConnect */}
            <div className="rounded-xl bg-surface p-6 shadow-sm space-y-4">
              <h3 className="font-semibold">About UCEConnect</h3>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-background">
                  {settings?.logoUrl
                    ? <img src={settings.logoUrl} alt="logo" className="h-full w-full object-contain rounded-lg" />
                    : <span className="text-2xl text-textSecondary">✕</span>
                  }
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isUploadingLogo}
                  onClick={() => logoInputRef.current?.click()}
                >
                  {isUploadingLogo ? "Uploading..." : "Change logo"}
                </Button>
                <input hidden type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoChange} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea rows={3} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  defaultValue="UCEConnect is the official incident management platform of the Universidad Central del Ecuador..." />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Institution</label>
                <input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  defaultValue="Universidad Central del Ecuador" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Contact</label>
                <input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  defaultValue="support@uceconnect.edu.ec" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Developed by</label>
                <input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  defaultValue="UCE Software Engineering Team" />
              </div>
              <Button disabled={isSaving} onClick={handleSaveGeneral}>Save</Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}