import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { runMatch, getMatches } from "../controllers/match.controller";

const router = Router();

router.use(requireAuth);

router.post("/:applicationId/match", runMatch);
router.get("/:applicationId/match", getMatches);

export default router;