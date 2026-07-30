import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { uploadResume, getResumes } from "../controllers/resume.controller";

const router = Router();

router.use(requireAuth);

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/", getResumes);

export default router;