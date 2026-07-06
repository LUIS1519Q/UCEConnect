import { Button } from "../../atoms/Button";
import { StatusBadge } from "../../atoms/StatusBadge";

import type { IncidentCardProps } from "./IncidentCard.types";

export default function IncidentCard({
  id,
  title,
  location,
  status,
  createdAt,
  onClick,
}: IncidentCardProps) {
  return (
    <div
      className="
        rounded-xl
        border
        border-border
        bg-surface
        p-5
        shadow-sm
      "
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-textSecondary">
            {id}
          </p>

          <h3 className="text-lg font-semibold text-textPrimary">
            {title}
          </h3>

          <p className="text-sm text-textSecondary">
            {location}
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-textSecondary">
          {createdAt}
        </span>

        <Button
          size="sm"
          onClick={onClick}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}