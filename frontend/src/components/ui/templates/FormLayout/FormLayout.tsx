import type { FormLayoutProps } from "./FormLayout.types";

export default function FormLayout({
  title,
  description,
  children,
  actions,
}: FormLayoutProps) {
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-surface p-6 shadow-sm">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-textPrimary">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-textSecondary">
            {description}
          </p>
        )}
      </header>

      <div className="space-y-6">
        {children}
      </div>

      {actions && (
        <footer className="mt-8 flex justify-end gap-3">
          {actions}
        </footer>
      )}
    </section>
  );
}