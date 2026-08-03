/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { createApplication } from "@/lib/api";
import { Application } from "@/types/application";

export function AddApplicationDialog({
  onApplicationAdded,
}: {
  onApplicationAdded: (application: Application) => void;
}) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [source, setSource] = useState("");

  function resetForm() {
    setCompanyName("");
    setPosition("");
    setSalaryRange("");
    setJobLink("");
    setSource("");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = (session as any).backendToken;

    try {
      const newApplication = await createApplication(token, {
        companyName,
        position,
        salaryRange: salaryRange || undefined,
        jobLink: jobLink || undefined,
        source: source || undefined,
      });

      onApplicationAdded(newApplication);
      resetForm();
      setOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Add Application
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Google"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Software Engineer Intern"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salaryRange">Salary Range (optional)</Label>
            <Input
              id="salaryRange"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="50k - 70k BDT"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobLink">Job Link (optional)</Label>
            <Input
              id="jobLink"
              value={jobLink}
              onChange={(e) => setJobLink(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Source (optional)</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="LinkedIn"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}