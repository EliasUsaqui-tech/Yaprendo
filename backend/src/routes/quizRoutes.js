import { Router } from "express";
import {
  getQuizzes,
  getQuizById,
  submitAttempt,
  getMyAttempts,
} from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", getQuizzes);
router.get("/attempts/me", protect, getMyAttempts);
router.get("/:id", getQuizById);
router.post("/:id/attempt", protect, submitAttempt);

export default router;