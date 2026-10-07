import { Router } from "express";
import { getProgress, updateProgress } from "../controllers/progress.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(authenticate, requireRole("student"));
router.get("/:courseId", getProgress);
router.put("/:courseId", updateProgress);
export default router;
