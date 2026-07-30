import prisma from "../utils/prisma";
import { ApplicationStatus } from "@prisma/client";

export async function getApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { notes: true, interviewSchedule: true },
  });
}

export async function createApplication(
  userId: string,
  data: {
    companyName: string;
    position: string;
    salaryRange?: string;
    jobLink?: string;
    source?: string;
  }
) {
  return prisma.application.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateApplication(
  applicationId: string,
  userId: string,
  data: Partial<{
    companyName: string;
    position: string;
    salaryRange: string;
    jobLink: string;
    source: string;
    status: ApplicationStatus;
  }>
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application || application.userId !== userId) {
    throw new Error("Application not found");
  }

  return prisma.application.update({
    where: { id: applicationId },
    data,
  });
}

export async function deleteApplication(applicationId: string, userId: string) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application || application.userId !== userId) {
    throw new Error("Application not found");
  }

  return prisma.application.delete({
    where: { id: applicationId },
  });
}