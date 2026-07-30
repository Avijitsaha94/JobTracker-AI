import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Resume } from "@/types/resume";

export function ResumeHistoryItem({ resume }: { resume: Resume }) {
  const uploadedDate = new Date(resume.uploadedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card>
      <CardContent className="space-y-3 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Version {resume.versionNumber}</p>
              <Badge variant="outline" className="text-xs font-normal">
                {uploadedDate}
              </Badge>
            </div>
          </div>
        </div>

        {resume.parsedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {resume.parsedSkills.map((skill, i) => (
              <Badge key={i} variant="secondary" className="font-normal">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {resume.parsedExperience && (
          <p className="text-sm text-muted-foreground">{resume.parsedExperience}</p>
        )}

        {resume.parsedSkills.length === 0 && !resume.parsedExperience && (
          <p className="text-xs text-muted-foreground">Not analyzed yet</p>
        )}
      </CardContent>
    </Card>
  );
}