import { Button } from "../../atoms/Button";
import { Modal } from "../Modal";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";

import type {
  SimilarIncidentModalProps,
} from "./SimilarIncidentModal.types";

const STATUS_STYLES: Record<string, string> = {
  open: "bg-info/10 text-info",
  in_progress: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
  rejected: "bg-danger/10 text-danger",
  cancelled: "bg-textSecondary/10 text-textSecondary",
};

function formatStatusLabel(status: string) {
  return status
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function SimilarIncidentModal({
  open,
  incident,
  isLoading,
  isError,
  onRetry,
  onClose,
}: SimilarIncidentModalProps) {
  if (!open) return null;

  const statusKey = incident?.status.toLowerCase() ?? "";
  const statusClass =
    STATUS_STYLES[statusKey] ?? "bg-textSecondary/10 text-textSecondary";

  return (
    <Modal
      open={open}
      title="Similar Incident"
      onClose={onClose}
      size="md"
      footer={
        !isLoading && !isError ? (
          <Button
            className="w-full"
            onClick={onClose}
          >
            Close
          </Button>
        ) : undefined
      }
    >
      {isLoading && (
        <LoadingState title="Loading incident details..." />
      )}

      {!isLoading && isError && (
        <ErrorState
          title="Couldn't load this incident"
          description="We couldn't load the details for this incident."
          onRetry={onRetry}
        />
      )}

      {!isLoading && !isError && incident && (
        <div className="space-y-4">

          <p className="text-sm text-textSecondary">
            {incident.ticket}
          </p>

          <div className="grid grid-cols-2 gap-y-3">

            <span className="font-medium">
              Title
            </span>

            <span>
              {incident.title}
            </span>

            <span className="font-medium">
              Date
            </span>

            <span>
              {incident.date}
            </span>

            <span className="font-medium">
              Status
            </span>

            <span>
              <span
                className={`
                  inline-flex
                  items-center
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-medium
                  ${statusClass}
                `}
              >
                {formatStatusLabel(incident.status)}
              </span>
            </span>

          </div>

          {incident.resolution && (
            <div>

              <h4 className="mb-2 font-semibold">
                Resolution
              </h4>

              <div className="rounded-lg border border-border p-3">
                {incident.resolution}
              </div>

            </div>
          )}

        </div>
      )}
    </Modal>
  );
}