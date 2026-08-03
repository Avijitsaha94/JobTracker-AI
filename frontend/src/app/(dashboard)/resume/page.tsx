/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getResumes } from "@/lib/api";
import { ResumeUpload } from "@/components/features/resume-upload";
import { ResumeHistoryItem } from "@/components/features/resume-history-item";
import { Resume } from "@/types/resume";
import { Loader2 } from "lucide-react";

export default function ResumePage() {
  const { data: session, status } = useSession();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResumes() {
      if (status !== "authenticated") return;

      const token = (session as any).backendToken;
      try {
        const data = await getResumes(token);
        setResumes(data);
      } catch (error) {
        console.error("Failed to load resumes:", error);
      } finally {
        setLoading(false);
      }
    }

    loadResumes();
  }, [status, session]);

  function handleUploadSuccess(newResume: Resume) {
    setResumes((prev) => [newResume, ...prev]);
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Resume</h1>
        <p className="text-muted-foreground"> 
          Upload your resume to get AI-powered job Match Scores 
                  </p>
      </div>

      <ResumeUpload onUploadSuccess={handleUploadSuccess} />

      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          Version History
        </h2>
        <div className="space-y-3">
          {resumes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No resumes uploaded yet.
            </p>
          ) : (
            resumes.map((resume) => (
              <ResumeHistoryItem key={resume.id} resume={resume} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}