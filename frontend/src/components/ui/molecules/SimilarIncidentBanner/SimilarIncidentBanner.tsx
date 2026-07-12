import { AlertTriangle, X } from "../../icons";

import { Button } from "../../atoms/Button";

import type { SimilarIncidentBannerProps } from "./SimilarIncidentBanner.types";

export default function SimilarIncidentBanner({
  title,
  description,
  onViewDetails,
  onDismiss,
}: SimilarIncidentBannerProps) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
        rounded-xl
        border
        border-warning
        bg-yellow-50
        p-4
      "
    >
      <div className="flex gap-3">
        <AlertTriangle
          size={22}
          className="mt-1 text-warning"
        />

        <div className="space-y-2">
          <h3 className="font-semibold text-textPrimary">
            {title}
          </h3>

          <p className="text-sm text-textSecondary">
            {description}
          </p>

          {onViewDetails && (
            <Button
              variant="link"
              onClick={onViewDetails}
            >
              View details
            </Button>
          )}
        </div>
      </div>

      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          aria-label="Close banner"
          onClick={onDismiss}
        >
          <X size={18} />
        </Button>
      )}
    </div>
  );
}