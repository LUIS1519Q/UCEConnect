import { Textarea } from "../../components/ui/atoms/Textarea";
import { StatusBadge } from "../../components/ui/atoms/StatusBadge";

export default function StudentShowcase() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-10">
        <header>
          <h1 className="text-3xl font-bold text-textPrimary">
            Student UI Showcase
          </h1>

          <p className="mt-2 text-textSecondary">
            Playground for Student UI components.
          </p>
        </header>

        {/* ===================== ATOMS ===================== */}
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-textPrimary">
            Atoms

            <div className="mt-6 space-y-6">
                <div>
                    <h3 className="mb-2 text-lg font-medium text-textPrimary">
                    Textarea
                    </h3>

                    <Textarea placeholder="Describe el problema..." />
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-medium text-textPrimary">
                    Status Badge
                </h3>

                <div className="flex flex-wrap gap-3">
                    <StatusBadge status="open" />
                    <StatusBadge status="inProgress" />
                    <StatusBadge status="resolved" />
                    <StatusBadge status="rejected" />
                </div>
            </div>

          </h2>

          <div className="mt-6">
            <p className="text-textSecondary">
              Próximamente...
            </p>
          </div>
        </section>

        {/* ===================== MOLECULES ===================== */}
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-textPrimary">
            Molecules
          </h2>

          <div className="mt-6">
            <p className="text-textSecondary">
              Próximamente...
            </p>
          </div>
        </section>

        {/* ===================== ORGANISMS ===================== */}
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-textPrimary">
            Organisms
          </h2>

          <div className="mt-6">
            <p className="text-textSecondary">
              Próximamente...
            </p>
          </div>
        </section>

        {/* ===================== TEMPLATES ===================== */}
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-textPrimary">
            Templates
          </h2>

          <div className="mt-6">
            <p className="text-textSecondary">
              Próximamente...
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}