import { Router } from "express";
import { register, login, getMe, updateProfile, forgotPassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);

// ¡ESTA ES LA LÍNEA QUE FALTABA!
router.put("/profile", protect, updateProfile); 

export default router;