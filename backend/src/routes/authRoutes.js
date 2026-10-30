import { Router } from "express";
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  forgotPassword, 
  becomeMentor 
} from "../controllers/authController.js";
import { chatWithAI } from "../controllers/aiController.js"; // <-- Importar

import { protect } from "../middleware/authMiddleware.js";

import { chatWithAI, generateCustomSession } from "../controllers/aiController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/ai/chat", protect, chatWithAI);
router.post("/ai/custom-session", protect, generateCustomSession); // <-- NUEVA RUTA
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);

router.put("/profile", protect, updateProfile); 

// 2. Agregamos la ruta para cambiar de rol
router.put("/become-mentor", protect, becomeMentor);

export default router;