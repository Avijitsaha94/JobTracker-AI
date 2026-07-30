import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { ApplicationCard } from "./application-card";
import { Application, ApplicationStatus } from "@/types/application";
import { cn } from "@/lib/utils";

const columnConfig: Record
  ApplicationStatus,
  { label: string; dotColor: string }
> = {
  APPLIED: { label: "Applied", dotColor: "bg-blue-500" },
  INTERVIEW: { label: "Interview", dotColor: "bg-amber-500" },
  OFFER: { label: "Offer", dotColor: "bg-emerald-500" },
  REJECTED: { label: "Rejected", dotColor: "bg-rose-500" },
};

export function KanbanColumn({
  status,
  applications,
}: {
  status: ApplicationStatus;
  applications: Application[];
}) {
  const config = columnConfig[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-lg bg-muted/50 p-3 transition-colors",
        isOver && "bg-muted"
      )}
    >
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={cn("h-2 w-2 rounded-full", config.dotColor)} />
        <h2 className="text-sm font-semibold">{config.label}</h2>
        <Badge variant="outline" className="ml-auto font-normal">
          {applications.length}
        </Badge>
      </div>
      <div className="flex flex-col gap-2">
        {applications.map((app) => (
          <ApplicationCard key={app.id} application={app} />
        ))}
        {applications.length === 0 && (
          <p className="px-1 py-6 text-center text-xs text-muted-foreground">
            No applications
          </p>
        )}
      </div>
    </div>
  );
}