import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Wallet } from "lucide-react";
import { Application } from "@/types/application";
import { JobMatchDialog } from "./job-match-dialog";
import { cn } from "@/lib/utils";

export function ApplicationCard({ application }: { application: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-shadow hover:shadow-md",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <CardHeader className="cursor-grab touch-none pb-2 active:cursor-grabbing" {...listeners} {...attributes}>
        <CardTitle className="flex items-start gap-2 text-base">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="line-clamp-2">{application.companyName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="cursor-grab touch-none space-y-2 pt-0 active:cursor-grabbing" {...listeners} {...attributes}>
        <p className="text-sm text-muted-foreground">{application.position}</p>
        {application.salaryRange && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wallet className="h-3.5 w-3.5" />
            <span>{application.salaryRange}</span>
          </div>
        )}
        {application.source && (
          <Badge variant="secondary" className="text-xs font-normal">
            {application.source}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <JobMatchDialog application={application} />
      </CardFooter>
    </Card>
  );
}