import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../services/application.service";

export async function getAll(req: AuthRequest, res: Response) {
  try {
    const applications = await getApplications(req.userId as string);
    res.status(200).json(applications);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
}

export async function create(req: AuthRequest, res: Response) {
  const { companyName, position, salaryRange, jobLink, source } = req.body;

  if (!companyName || !position) {
    return res.status(400).json({ error: "Company name and position are required" });
  }

  try {
    const application = await createApplication(req.userId as string, {
      companyName,
      position,
      salaryRange,
      jobLink,
      source,
    });
    res.status(201).json(application);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create application" });
  }
}

export async function update(req: AuthRequest, res: Response) {
  const { id } = req.params;

  try {
    const application = await updateApplication(id, req.userId as string, req.body);
    res.status(200).json(application);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  const { id } = req.params;

  try {
    await deleteApplication(id, req.userId as string);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}