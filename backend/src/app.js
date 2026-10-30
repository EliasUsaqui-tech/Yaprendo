import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import techniqueRoutes from "./routes/techniqueRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// CONFIGURACIÓN DE CORS: Permitimos los dominios de producción
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://utec-acompanamiento.vercel.app",
    "https://yaprendo.vercel.app" // <-- CAMBIA ESTO POR EL DOMINIO QUE TE DIO VERCEL
  ],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Acompañamiento UTEC funcionando",
    version: "1.0.0",
    endpoints: [
      "/api/auth",
      "/api/courses",
      "/api/techniques",
      "/api/quizzes",
      "/api/mentors",
      "/api/progress",
    ],
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/techniques", techniqueRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/progress", progressRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;