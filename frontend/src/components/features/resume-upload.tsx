"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { uploadResume } from "@/lib/api";
import { Resume } from "@/types/resume";
import { cn } from "@/lib/utils";

export function ResumeUpload({
  onUploadSuccess,
}: {
  onUploadSuccess: (resume: Resume) => void;
}) {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and DOCX files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }

    setUploading(true);
    const token = (session as any).backendToken;

    try {
      const resume = await uploadResume(token, file);
      onUploadSuccess(resume);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInputChange}
            className="hidden"
          />
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF or DOCX, up to 5MB
                </p>
              </div>
            </>
          )}
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}