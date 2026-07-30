export type ApplicationStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export interface Application {
  id: string;
  companyName: string;
  position: string;
  salaryRange: string | null;
  jobLink: string | null;
  source: string | null;
  status: ApplicationStatus;
  appliedDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}