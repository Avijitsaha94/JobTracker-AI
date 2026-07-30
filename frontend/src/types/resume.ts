export interface Resume {
  id: string;
  fileUrl: string;
  versionNumber: number;
  parsedSkills: string[];
  parsedExperience: string | null;
  parsedEducation: string | null;
  uploadedAt: string;
  userId: string;
}