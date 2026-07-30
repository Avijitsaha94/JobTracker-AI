import { Application, ApplicationStatus } from "@/types/application";
import { Resume } from "@/types/resume";
import { MatchResult } from "@/types/match";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function signupUser(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export async function getApplications(token: string): Promise<Application[]> {
  const res = await fetch(`${API_URL}/api/applications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }

  return res.json();
}

export async function createApplication(
  token: string,
  data: {
    companyName: string;
    position: string;
    salaryRange?: string;
    jobLink?: string;
    source?: string;
  }
): Promise<Application> {
  const res = await fetch(`${API_URL}/api/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to create application");
  }

  return result;
}

export async function updateApplicationStatus(
  token: string,
  applicationId: string,
  status: ApplicationStatus
): Promise<Application> {
  const res = await fetch(`${API_URL}/api/applications/${applicationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to update application");
  }

  return result;
}

export async function uploadResume(token: string, file: File): Promise<Resume> {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_URL}/api/resumes/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to upload resume");
  }

  return result;
}

export async function getResumes(token: string): Promise<Resume[]> {
  const res = await fetch(`${API_URL}/api/resumes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch resumes");
  }

  return res.json();
}

export async function runJobMatch(
  token: string,
  applicationId: string,
  jobDescription: string
): Promise<MatchResult> {
  const res = await fetch(`${API_URL}/api/applications/${applicationId}/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jobDescription }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to run match");
  }

  return result;
}