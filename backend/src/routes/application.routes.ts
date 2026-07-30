import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { getAll, create, update, remove } from "../controllers/application.controller";

const router = Router();

router.use(requireAuth);

router.get("/", getAll);
router.post("/", create);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;