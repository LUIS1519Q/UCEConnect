import { IncidentCard } from "../../molecules/IncidentCard";

import type { IncidentListProps } from "./IncidentList.types";

export default function IncidentList({
  incidents,
}: IncidentListProps) {
  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <IncidentCard
          key={`${incident.title}-${incident.createdAt}`}
          {...incident}
        />
      ))}
    </div>
  );
}