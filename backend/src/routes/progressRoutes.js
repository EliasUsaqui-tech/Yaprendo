import { Router } from "express";
import {
  getMyProgress,
  getMyProgressByCourse,
} from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/me", protect, getMyProgress);
router.get("/me/course/:courseId", protect, getMyProgressByCourse);

export default router;