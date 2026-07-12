import { AppLayout } from "../../components/ui/templates/AppLayout";

export default function HelpPage() {
  return (
    <AppLayout
      title="Help"
      studentName="Luis Paspuezan"
      sidebarItems={[]}
    >
      <div className="space-y-6">

        <section>
          <h2 className="text-2xl font-semibold">
            Frequently Asked Questions
          </h2>

          <p className="text-textSecondary">
            This section will contain the most common questions about the
            platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">
            Contact
          </h2>

          <p className="text-textSecondary">
            support@uceconnect.edu.ec
          </p>
        </section>

      </div>
    </AppLayout>
  );
}