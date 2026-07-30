import { genAI, GEMINI_MODEL } from "../utils/gemini";

export interface ParsedResumeData {
  skills: string[];
  experienceSummary: string;
  educationSummary: string;
}

export interface MatchResultData {
  matchScore: number;
  missingSkills: string[];
  suggestions: string;
}

export async function parseResumeWithAI(resumeText: string): Promise<ParsedResumeData> {
  const prompt = `You are a resume parser. Read the following resume text and extract structured information.

Resume text:
"""
${resumeText}
"""

Extract:
1. A list of technical and professional skills mentioned (e.g. programming languages, frameworks, tools).
2. A brief 2-3 sentence summary of the person's work experience.
3. A brief 1-2 sentence summary of their education.

If any section is not found in the text, return an empty array or empty string for that field.`;

  const response = await genAI.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          skills: {
            type: "array",
            items: { type: "string" },
          },
          experienceSummary: { type: "string" },
          educationSummary: { type: "string" },
        },
        required: ["skills", "experienceSummary", "educationSummary"],
      },
    },
  });

  const parsed = JSON.parse(response.text as string);

  return {
    skills: parsed.skills || [],
    experienceSummary: parsed.experienceSummary || "",
    educationSummary: parsed.educationSummary || "",
  };
}

export async function matchResumeToJob(
  resumeSkills: string[],
  resumeExperience: string,
  jobDescription: string
): Promise<MatchResultData> {
  const prompt = `You are a career advisor helping a job applicant understand how well their resume matches a job posting.

Candidate's skills: ${resumeSkills.join(", ") || "Not specified"}
Candidate's experience summary: ${resumeExperience || "Not specified"}

Job description:
"""
${jobDescription}
"""

Analyze the match between the candidate and this job posting. Provide:
1. A match score from 0 to 100 representing how well the candidate's skills and experience align with the job requirements.
2. A list of important skills mentioned in the job description that are missing from the candidate's skill list.
3. 2-3 short, actionable suggestions to help the candidate improve their resume or better position themselves for this role.

Be honest and realistic in the score - do not inflate it.`;

  const response = await genAI.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          matchScore: { type: "number" },
          missingSkills: {
            type: "array",
            items: { type: "string" },
          },
          suggestions: { type: "string" },
        },
        required: ["matchScore", "missingSkills", "suggestions"],
      },
    },
  });

  const parsed = JSON.parse(response.text as string);

  return {
    matchScore: Math.round(parsed.matchScore) || 0,
    missingSkills: parsed.missingSkills || [],
    suggestions: parsed.suggestions || "",
  };
}