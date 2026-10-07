import { Router } from "express";
import { enroll, getEnrollment, myEnrollments } from "../controllers/enrollments.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);
router.post("/", requireRole("student"), enroll);
router.get("/my", requireRole("student"), myEnrollments);
router.get("/:id", getEnrollment);
export default router;
