import { Button } from "../../atoms/Button";

import type { ErrorStateProps } from "./ErrorState.types";

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load the requested information.",
  retryLabel = "Try Again",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="max-w-md text-center">

        <div
          className="mb-4 text-5xl"
          aria-hidden="true"
        >
          ⚠️
        </div>

        <h2 className="text-xl font-semibold text-textPrimary">
          {title}
        </h2>

        <p className="mt-2 text-textSecondary">
          {description}
        </p>

        {onRetry && (
          <div className="mt-6">
            <Button onClick={onRetry}>
              {retryLabel}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}