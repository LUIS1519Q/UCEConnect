import { AppLayout } from "../../components/ui/templates/AppLayout";

export default function AboutPage() {
  return (
    <AppLayout
      title="About UCEConnect"
      studentName="Luis Paspuezan"
      sidebarItems={[]}
    >
      <div className="space-y-6">

        <section>
          <h2 className="text-2xl font-semibold text-textPrimary">
            About
          </h2>

          <p className="mt-2 text-textSecondary">
            UCEConnect is a platform that allows university students to
            report and track incidents within the university community.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-textPrimary">
            Version
          </h2>

          <p className="mt-2 text-textSecondary">
            v1.0.0
          </p>
        </section>

      </div>
    </AppLayout>
  );
}