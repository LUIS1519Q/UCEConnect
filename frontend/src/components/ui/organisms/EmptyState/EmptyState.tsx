import type { EmptyStateProps } from "./EmptyState.types";

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="max-w-md text-center">

        <div
          className="mb-4 text-5xl"
          aria-hidden="true"
        >
          📭
        </div>

        <h2 className="text-xl font-semibold text-textPrimary">
          {title}
        </h2>

        <p className="mt-2 text-textSecondary">
          {description}
        </p>

        {action && (
          <div className="mt-6">
            {action}
          </div>
        )}

      </div>
    </div>
  );
}