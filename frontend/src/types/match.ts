export interface MatchResult {
  id: string;
  matchScore: number;
  missingSkills: string[];
  suggestions: string | null;
  createdAt: string;
  applicationId: string;
  resumeId: string;
}