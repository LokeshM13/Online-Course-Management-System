import { Router } from "express";
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse } from "../controllers/courses.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();
router.get("/", listCourses);
router.get("/:id", getCourse);
router.post("/", authenticate, requireRole("admin"), createCourse);
router.put("/:id", authenticate, requireRole("admin"), updateCourse);
router.delete("/:id", authenticate, requireRole("admin"), deleteCourse);
export default router;
