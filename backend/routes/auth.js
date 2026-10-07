import { Router } from "express";
import { login, profile, register } from "../controllers/auth.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, profile);
export default router;
