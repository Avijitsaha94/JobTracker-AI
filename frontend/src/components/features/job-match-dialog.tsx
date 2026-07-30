"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { runJobMatch } from "@/lib/api";
import { Application } from "@/types/application";
import { MatchResult } from "@/types/match";
import { cn } from "@/lib/utils";

export function JobMatchDialog({ application }: { application: Application }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);

  async function handleRunMatch() {
    setError("");
    setLoading(true);

    const token = (session as any).backendToken;

    try {
      const matchResult = await runJobMatch(token, application.id, jobDescription);
      setResult(matchResult);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function scoreColor(score: number) {
    if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 40) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setResult(null);
          setJobDescription("");
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI Match
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>AI Job Match — {application.companyName}</DialogTitle>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={8}
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button onClick={handleRunMatch} disabled={loading || jobDescription.trim().length < 20}>
                {loading ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1.5 h-4 w-4" />
                    Run AI Match
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-2">
              <div className="text-center">
                <p className={cn("text-4xl font-bold", scoreColor(result.matchScore))}>
                  {result.matchScore}%
                </p>
                <p className="text-xs text-muted-foreground">Match Score</p>
              </div>
            </div>

            {result.missingSkills.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  MISSING SKILLS
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {result.suggestions && (
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  SUGGESTIONS
                </p>
                <p className="text-sm text-muted-foreground">{result.suggestions}</p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setResult(null)}>
                Run Another Match
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}