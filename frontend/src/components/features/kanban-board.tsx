"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useSession } from "next-auth/react";
import { KanbanColumn } from "./kanban-column";
import { Application, ApplicationStatus } from "@/types/application";
import { updateApplicationStatus } from "@/lib/api";

const statuses: ApplicationStatus[] = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export function KanbanBoard({
  applications,
  onApplicationUpdated,
}: {
  applications: Application[];
  onApplicationUpdated: (application: Application) => void;
}) {
  const { data: session } = useSession();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const applicationId = active.id as string;
    const newStatus = over.id as ApplicationStatus;

    const application = applications.find((app) => app.id === applicationId);
    if (!application || application.status === newStatus) return;

    const token = (session as any).backendToken;

    try {
      const updated = await updateApplicationStatus(token, applicationId, newStatus);
      onApplicationUpdated(updated);
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={applications.filter((app) => app.status === status)}
          />
        ))}
      </div>
    </DndContext>
  );
}