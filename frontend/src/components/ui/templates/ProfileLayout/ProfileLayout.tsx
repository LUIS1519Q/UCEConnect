import type { ProfileLayoutProps } from "./ProfileLayout.types";

export default function ProfileLayout({
  title,
  children,
  sidebar,
}: ProfileLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 text-3xl font-bold text-textPrimary">
        {title}
      </h1>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {sidebar && (
          <aside className="rounded-xl border border-border bg-surface p-4 shadow-sm">
            {sidebar}
          </aside>
        )}

        <main className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}