import { Textarea } from "../../components/ui/atoms/Textarea";
import { StatusBadge } from "../../components/ui/atoms/StatusBadge";
import { FileChip } from "../../components/ui/atoms/FileChip";
import { Avatar } from "../../components/ui/atoms/Avatar";
import { SearchBar } from "../../components/ui/molecules/SearchBar";
import { IncidentCard } from "../../components/ui/molecules/IncidentCard";
import { EvidenceItem } from "../../components/ui/molecules/EvidenceItem";
import { NotificationItem } from "../../components/ui/molecules/NotificationItem";
import { ProfileInfoItem } from "../../components/ui/molecules/ProfileInfoItem";

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

            <div>
                <h3 className="mb-4 text-lg font-medium text-textPrimary">
                    File Chip
                </h3>

                <div className="flex flex-wrap gap-3">
                    <FileChip fileName="incident-image.png" />
                    <FileChip fileName="evidence.pdf" />
                    <FileChip fileName="report.docx" />
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-medium text-textPrimary">
                    Avatar
                </h3>

                <div className="flex items-center gap-4">
                    <Avatar alt="Student avatar" size="sm" />
                    <Avatar alt="Student avatar" size="md" />
                    <Avatar alt="Student avatar" size="lg" />
                </div>
            </div>

          </h2>
        </section>

        {/* ===================== MOLECULES ===================== */}
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-textPrimary">
            Molecules
          </h2>

            <div>
              <h3 className="mb-4 text-lg font-medium text-textPrimary">
                Search Bar
              </h3>

              <SearchBar placeholder="Search incidents..." />
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-textPrimary">
                Incident Card
              </h3>

              <IncidentCard
                title="Internet connection issue"
                location="Building A - Lab 3"
                status="open"
                createdAt="Jun 29, 2026"
              />
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-textPrimary">
                Evidence Item
              </h3>

              <EvidenceItem
                fileName="incident-photo.jpg"
                onRemove={() => {}}
              />
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-textPrimary">
                Notification Item
              </h3>

              <NotificationItem
                title="Incident Updated"
                message="Your incident status has changed to In Progress."
                date="2 hours ago"
                unread
              />
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-textPrimary">
                Profile Info Item
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <ProfileInfoItem
                  label="Student ID"
                  value="2023123456"
                />

                <ProfileInfoItem
                  label="Career"
                  value="Software Engineering"
                />
              </div>
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