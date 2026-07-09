import { AppLayout } from "../../components/ui/templates/AppLayout";

export default function NotificationsPage() {
  return (
    <AppLayout
      title="Notifications"
      studentName="Luis Paspuezan"
      sidebarItems={[]}
    >
      <div className="flex h-96 items-center justify-center rounded-xl border border-dashed border-border">

        <p className="text-textSecondary">
          You don't have notifications yet.
        </p>

      </div>
    </AppLayout>
  );
}