import { Router } from "express";
import {
  getTechniques,
  getTechniqueById,
  createTechnique,
} from "../controllers/techniqueController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", getTechniques);
router.get("/:id", getTechniqueById);
router.post("/", protect, requireRole("admin"), createTechnique);

export default router;