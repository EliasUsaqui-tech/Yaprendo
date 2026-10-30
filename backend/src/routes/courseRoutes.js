import { Router } from "express";
import {
  getCourses,
  getCourseById,
  getCourseTopics,
  getTopicById,
  createCourse,
} from "../controllers/courseController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", getCourses);
router.get("/topics/:id", getTopicById); // <-- RUTA NUEVA PARA EL DETALLE DEL TEMA
router.get("/:id", getCourseById);
router.get("/:id/topics", getCourseTopics);
router.post("/", protect, requireRole("admin"), createCourse);

export default router;