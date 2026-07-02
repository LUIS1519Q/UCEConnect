import type { DetailLayoutProps } from "./DetailLayout.types";

export default function DetailLayout({
  title,
  subtitle,
  children,
  actions,
}: DetailLayoutProps) {
  return (
    <section className="mx-auto w-full max-w-4xl rounded-xl border border-border bg-surface p-6 shadow-sm">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-textSecondary">
              {subtitle}
            </p>
          )}
        </div>

        {actions}
      </header>

      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}