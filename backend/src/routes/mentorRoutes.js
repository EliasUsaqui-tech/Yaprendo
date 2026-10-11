import { Router } from "express";
import {
  getMentors,
  getMentorById,
  createMentor,
} from "../controllers/mentorController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", getMentors);
router.get("/:id", getMentorById);
router.post("/", protect, requireRole("mentor", "admin"), createMentor);

export default router;