export type Status =
  | "open"
  | "inProgress"
  | "resolved"
  | "rejected";

export interface StatusBadgeProps {
  status: Status;
}