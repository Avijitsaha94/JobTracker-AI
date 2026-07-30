import { Response } from "express";
import path from "path";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createResumeRecord, getResumesByUser } from "../services/resume.service";

export async function uploadResume(req: AuthRequest, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const fileUrl = `/uploads/${req.file.filename}`;
    const absoluteFilePath = path.join(__dirname, "../../uploads", req.file.filename);

    const resume = await createResumeRecord(req.userId as string, fileUrl, absoluteFilePath);
    res.status(201).json(resume);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to save resume" });
  }
}

export async function getResumes(req: AuthRequest, res: Response) {
  try {
    const resumes = await getResumesByUser(req.userId as string);
    res.status(200).json(resumes);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
}