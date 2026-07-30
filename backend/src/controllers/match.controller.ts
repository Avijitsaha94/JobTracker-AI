import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createMatchResult, getMatchResultsForApplication } from "../services/match.service";

export async function runMatch(req: AuthRequest, res: Response) {
  const { applicationId } = req.params;
  const { jobDescription } = req.body;

  if (!jobDescription || jobDescription.trim().length < 20) {
    return res.status(400).json({ error: "Please provide a valid job description" });
  }

  try {
    const result = await createMatchResult(applicationId, req.userId as string, jobDescription);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getMatches(req: AuthRequest, res: Response) {
  const { applicationId } = req.params;

  try {
    const results = await getMatchResultsForApplication(applicationId, req.userId as string);
    res.status(200).json(results);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}