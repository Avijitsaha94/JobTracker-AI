import prisma from "../utils/prisma";
import { extractTextFromFile } from "../utils/extractText";
import { parseResumeWithAI } from "./ai.service";

export async function createResumeRecord(userId: string, fileUrl: string, absoluteFilePath: string) {
  const existingResumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { versionNumber: "desc" },
    take: 1,
  });

  const nextVersion = existingResumes.length > 0 ? existingResumes[0].versionNumber + 1 : 1;

  let extractedText = "";
  try {
    extractedText = await extractTextFromFile(absoluteFilePath);
  } catch (error) {
    console.error("Text extraction failed:", error);
  }

  let skills: string[] = [];
  let experienceSummary = "";
  let educationSummary = "";

  if (extractedText) {
    try {
      const parsed = await parseResumeWithAI(extractedText.slice(0, 8000));
      skills = parsed.skills;
      experienceSummary = parsed.experienceSummary;
      educationSummary = parsed.educationSummary;
    } catch (error) {
      console.error("AI parsing failed:", error);
    }
  }

  return prisma.resume.create({
    data: {
      userId,
      fileUrl,
      versionNumber: nextVersion,
      parsedSkills: skills,
      parsedExperience: experienceSummary || null,
      parsedEducation: educationSummary || null,
    },
  });
}

export async function getResumesByUser(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { versionNumber: "desc" },
  });
}