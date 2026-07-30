import prisma from "../utils/prisma";
import { matchResumeToJob } from "./ai.service";

export async function createMatchResult(
  applicationId: string,
  userId: string,
  jobDescription: string
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application || application.userId !== userId) {
    throw new Error("Application not found");
  }

  const latestResume = await prisma.resume.findFirst({
    where: { userId },
    orderBy: { versionNumber: "desc" },
  });

  if (!latestResume) {
    throw new Error("Please upload a resume before running a match");
  }

  const aiResult = await matchResumeToJob(
    latestResume.parsedSkills,
    latestResume.parsedExperience || "",
    jobDescription
  );

  return prisma.matchResult.create({
    data: {
      applicationId,
      resumeId: latestResume.id,
      matchScore: aiResult.matchScore,
      missingSkills: aiResult.missingSkills,
      suggestions: aiResult.suggestions,
    },
  });
}

export async function getMatchResultsForApplication(applicationId: string, userId: string) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application || application.userId !== userId) {
    throw new Error("Application not found");
  }

  return prisma.matchResult.findMany({
    where: { applicationId },
    orderBy: { createdAt: "desc" },
  });
}