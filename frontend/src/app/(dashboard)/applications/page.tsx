/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getApplications } from "@/lib/api";
import { KanbanBoard } from "@/components/features/kanban-board";
import { AddApplicationDialog } from "@/components/features/add-application-dialog";
import { Application } from "@/types/application";
import { Loader2 } from "lucide-react";

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      if (status !== "authenticated") return;

      const token = (session as any).backendToken;
      try {
        const data = await getApplications(token);
        setApplications(data);
      } catch (error) {
        console.error("Failed to load applications:", error);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [status, session]);

  function handleApplicationAdded(newApplication: Application) {
    setApplications((prev) => [newApplication, ...prev]);
  }

  function handleApplicationUpdated(updatedApplication: Application) {
    setApplications((prev) =>
      prev.map((app) => (app.id === updatedApplication.id ? updatedApplication : app))
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-muted-foreground">
            Track and manage all your job applications in one place
          </p>
        </div>
        <AddApplicationDialog onApplicationAdded={handleApplicationAdded} />
      </div>
      <KanbanBoard
        applications={applications}
        onApplicationUpdated={handleApplicationUpdated}
      />
    </div>
  );
}