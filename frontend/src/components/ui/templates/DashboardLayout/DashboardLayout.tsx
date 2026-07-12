import type { DashboardLayoutProps } from "./DashboardLayout.types";

export default function DashboardLayout({
  header,
  sidebar,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        {header}
      </header>

      <div className="mx-auto flex max-w-7xl">
        {sidebar && (
          <aside className="hidden w-64 border-r border-border bg-surface lg:block">
            {sidebar}
          </aside>
        )}

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}