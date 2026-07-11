import { AlertTriangle, X } from "../../icons";
import { Button } from "../../atoms/Button";

import type { SimilarIncidentBannerProps } from "./SimilarIncidentBanner.types";

export default function SimilarIncidentBanner({
  incident,
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

        <div className="flex flex-1 justify-between gap-4">

          <div>

            <h3 className="font-semibold text-textPrimary">
              Similar incident found
            </h3>

            <p className="mt-1 text-sm text-textSecondary">
              {incident.ticket} • Status: {incident.status}
            </p>

            <p className="text-sm text-textPrimary">
              {incident.title}
            </p>

          </div>

          {onViewDetails && (
            <Button
              variant="link"
              size="sm"
              className="shrink-0 self-start"
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
          onClick={onDismiss}
        >
          <X size={18}/>
        </Button>
      )}

    </div>
  );
}