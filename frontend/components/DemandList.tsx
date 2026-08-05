import { Demand, DemandStatus } from "../types/demand";
import { DemandCard } from "./DemandCard";

interface DemandListProps {
  demands: Demand[];
  statuses: DemandStatus[];
  onStatusChange: (id: string, status: DemandStatus) => void;
}

export function DemandList({ demands, statuses, onStatusChange }: DemandListProps) {
  return (
    <div className="space-y-4">
      {demands.map((demand) => (
        <DemandCard key={demand.id} demand={demand} statuses={statuses} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}
