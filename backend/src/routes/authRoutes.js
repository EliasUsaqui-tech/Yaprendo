import { Router } from "express";
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  forgotPassword, 
  becomeMentor 
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/ai/chat", protect, chatWithAI);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);

router.put("/profile", protect, updateProfile); 

// 2. Agregamos la ruta para cambiar de rol
router.put("/become-mentor", protect, becomeMentor);

export default router;