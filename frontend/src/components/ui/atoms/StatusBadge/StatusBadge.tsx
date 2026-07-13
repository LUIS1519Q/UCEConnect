import { cn } from "../../../../utils/cn";

import type { IncidentStatus } from "../../../../types/incident";
import type { StatusBadgeProps } from "./StatusBadge.types";

const statusConfig: Record<
  IncidentStatus,
  {
    label: string;
    className: string;
  }
> = {
  open: {
    label: "Open",
    className:
      "bg-blue-100 text-blue-700 border-blue-200",
  },

  in_progress: {
    label: "In Progress",
    className:
      "bg-amber-100 text-amber-700 border-amber-200",
  },

  resolved: {
    label:
      "Resolved",
    className:
      "bg-green-100 text-green-700 border-green-200",
  },

  rejected: {
    label:
      "Rejected",
    className:
      "bg-red-100 text-red-700 border-red-200",
  },

  cancelled: {
    label:
      "Cancelled",
    className:
      "bg-gray-100 text-gray-700 border-gray-200",
  },
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const { label, className } = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        className
      )}
    >
      {label}
    </span>
  );
}