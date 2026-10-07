import { Router } from "express";
import { dashboard, listEnrollments, listUsers } from "../controllers/admin.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(authenticate, requireRole("admin"));
router.get("/dashboard", dashboard);
router.get("/users", listUsers);
router.get("/enrollments", listEnrollments);
export default router;
