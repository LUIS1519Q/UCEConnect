import { AlertTriangle, Search, X } from "../../icons";
import { Button } from "../../atoms/Button";

import type {
  SimilarIncidentSectionProps,
} from "./SimilarIncidentSection.types";

export default function SimilarIncidentSection({
  hasSearched,
  isLoading,
  incident,
  onViewDetails,
  onDismiss,
}: SimilarIncidentSectionProps) {

  if (!hasSearched) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">

        <div className="flex items-center gap-2">
          <Search
            size={18}
            className="text-textSecondary"
          />

          <h3 className="font-medium">
            Similar incidents
          </h3>
        </div>

        <p className="mt-2 text-sm text-textSecondary">
          Start typing to search for similar incidents.
        </p>

      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">

        <p className="text-sm text-textSecondary">
          Searching similar incidents...
        </p>

      </div>
    );
  }

  if (!incident) {
    return (
      <div className="rounded-xl border border-success bg-green-50 p-4">

        <p className="text-sm text-success">
          No similar incidents found.
        </p>

      </div>
    );
  }

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
      <div className="flex flex-1 gap-3">

        <AlertTriangle
          size={22}
          className="mt-1 text-warning"
        />

        <div className="flex-1">

          <div className="flex items-start justify-between gap-4">

            <div>

              <h3 className="font-semibold">
                Similar incident found
              </h3>

              <p className="mt-1 text-sm text-textSecondary">
                {incident.ticket} • Status: {incident.status}
              </p>

              <p className="text-sm">
                {incident.title}
              </p>

            </div>

            {onViewDetails && (
              <Button
                variant="link"
                size="sm"
                onClick={onViewDetails}
              >
                View details
              </Button>
            )}

          </div>

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