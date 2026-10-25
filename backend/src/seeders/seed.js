import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Topic from "../models/Topic.js";
import StudyTechnique from "../models/StudyTechnique.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

const run = async () => {
  await connectDB();

  console.log("Limpiando colecciones...");
  await Promise.all([
    User.deleteMany(),
    Course.deleteMany(),
    Topic.deleteMany(),
    StudyTechnique.deleteMany(),
    Quiz.deleteMany(),
    Question.deleteMany(),
  ]);

  console.log("Creando usuarios...");
  const admin = await User.create({
    name: "Admin UTEC",
    email: "admin@utec.edu.pe",
    password: "admin123",
    cycle: "egresado",
    role: "admin",
  });

  const alumno = await User.create({
    name: "Leonardo Autodidacta",
    email: "leonardo@utec.edu.pe",
    password: "leonardo123",
    cycle: "1",
    role: "student",
  });

  // Aquí está la magia: Andrea ahora es un User con bio y expertise
  const mentorUser = await User.create({
    name: "Andrea Mentor",
    email: "andrea@utec.edu.pe",
    password: "andrea123",
    cycle: "6",
    role: "mentor",
    bio: "Estudiante de 6to ciclo, me gusta explicar con ejemplos prácticos.",
    expertise: ["Cálculo 1", "Física 1"],
  });

  console.log("Creando cursos...");
  const calc1 = await Course.create({
    name: "Cálculo 1",
    code: "CAL1",
    description: "Límites, derivadas e introducción a integrales.",
    cycle: "1",
    color: "#1e40af",
  });

  const fisica = await Course.create({
    name: "Física 1",
    code: "FIS1",
    description: "Cinemática, dinámica y leyes de Newton.",
    cycle: "1",
    color: "#dc2626",
  });

  const fundCalc = await Course.create({
    name: "Fundamentos del Cálculo",
    code: "FUNCAL",
    description: "Álgebra, funciones y trigonometría base.",
    cycle: "1",
    color: "#059669",
  });

  console.log("📖 Creando temas...");
  const tLimites = await Topic.create({
    name: "Límites",
    description: "Concepto de límite, límites laterales y al infinito.",
    course: calc1._id,
    order: 1,
  });
  const tDerivadas = await Topic.create({
    name: "Derivadas",
    description: "Reglas de derivación y aplicaciones.",
    course: calc1._id,
    order: 2,
  });
  const tCinematica = await Topic.create({
    name: "Cinemática",
    description: "MRU, MRUV y caída libre.",
    course: fisica._id,
    order: 1,
  });
  const tFunciones = await Topic.create({
    name: "Funciones",
    description: "Dominio, rango y tipos de funciones.",
    course: fundCalc._id,
    order: 1,
  });

  calc1.topics = [tLimites._id, tDerivadas._id];
  fisica.topics = [tCinematica._id];
  fundCalc.topics = [tFunciones._id];
  await Promise.all([calc1.save(), fisica.save(), fundCalc.save()]);

  console.log("Creando técnicas de estudio...");
  await StudyTechnique.create([
    {
      title: "Active Recall con tarjetas",
      description:
        "Crea tarjetas con preguntas y respóndelas sin mirar apuntes. Fuerza a tu cerebro a recuperar la información.",
      steps: [
        "Divide el tema en conceptos clave",
        "Escribe una pregunta por tarjeta",
        "Responde en voz alta sin mirar",
        "Marca las que falles y repítelas al día siguiente",
      ],
      type: "active-recall",
      course: calc1._id,
      topic: tLimites._id,
      estimatedMinutes: 25,
    },
    {
      title: "Repetición espaciada (1-3-7)",
      description:
        "Repasa el tema al día 1, día 3 y día 7. Aprovecha la curva del olvido.",
      steps: [
        "Estudia hoy y agenda repaso mañana",
        "Repasa en 3 días",
        "Repasa en 7 días",
      ],
      type: "spaced-repetition",
      course: fisica._id,
      topic: tCinematica._id,
      estimatedMinutes: 15,
    },
    {
      title: "Técnica Feynman",
      description:
        "Explica el tema como si se lo enseñaras a un niño de 12 años. Detecta vacíos al instante.",
      steps: [
        "Escribe el concepto arriba de una hoja",
        "Explícalo con palabras simples",
        "Identifica dónde te trabas",
        "Vuelve a la fuente y simplifica",
      ],
      type: "feynman",
      course: fundCalc._id,
      topic: tFunciones._id,
      estimatedMinutes: 20,
    },
  ]);

  console.log("Creando quizzes y preguntas...");
  const quizLimites = await Quiz.create({
    title: "Quiz rápido: Límites",
    description: "Evalúa tu comprensión real de límites en 3 preguntas.",
    topic: tLimites._id,
    course: calc1._id,
    difficulty: "basico",
    estimatedMinutes: 5,
  });

  const q1 = await Question.create({
    quiz: quizLimites._id,
    statement: "¿Cuál es el límite de (x² - 1)/(x - 1) cuando x → 1?",
    options: ["0", "1", "2", "No existe"],
    correctIndex: 2,
    explanation:
      "Factorizando: (x-1)(x+1)/(x-1) = x+1. Al evaluar en x=1 → 2.",
    order: 1,
  });
  const q2 = await Question.create({
    quiz: quizLimites._id,
    statement: "Si lim(x→a) f(x) = L, ¿qué se cumple?",
    options: [
      "f(a) = L siempre",
      "f puede no estar definida en a",
      "f es continua en a",
      "f(a) ≠ L",
    ],
    correctIndex: 1,
    explanation:
      "El límite describe el comportamiento cerca de a, no necesariamente en a.",
    order: 2,
  });
  const q3 = await Question.create({
    quiz: quizLimites._id,
    statement: "El límite de 1/x cuando x → ∞ es:",
    options: ["∞", "1", "0", "No existe"],
    correctIndex: 2,
    explanation: "Cuando x crece, 1/x se aproxima a 0.",
    order: 3,
  });

  quizLimites.questions = [q1._id, q2._id, q3._id];
  await quizLimites.save();

  console.log("\nSeed completado con éxito");
  console.log("Admin: admin@utec.edu.pe / admin123");
  console.log("Alumno: leonardo@utec.edu.pe / leonardo123");
  console.log("Mentor: andrea@utec.edu.pe / andrea123");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Error en seed:", err);
  process.exit(1);
});