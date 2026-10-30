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
    //User.deleteMany(),
    Course.deleteMany(),
    Topic.deleteMany(),
    StudyTechnique.deleteMany(),
    Quiz.deleteMany(),
    Question.deleteMany(),
  ]);

  console.log("Creando usuarios...");
  await User.create([
    { name: "Admin UTEC", email: "admin@utec.edu.pe", password: "admin123", cycle: "egresado", role: "admin" },
    { name: "Leonardo Autodidacta", email: "leonardo@utec.edu.pe", password: "leonardo123", cycle: "1", role: "student" },
    { name: "Andrea Mentor", email: "andrea@utec.edu.pe", password: "andrea123", cycle: "6", role: "mentor", bio: "Estudiante de 6to ciclo, me gusta explicar con ejemplos prácticos.", expertise: ["Cálculo 1", "Fundamentos del Cálculo"] }
  ]);

  console.log("Creando cursos...");
  const calc1 = await Course.create({
    name: "Cálculo 1",
    code: "CAL1",
    description: "Límites, derivadas e introducción a integrales.",
    cycle: "1",
    color: "#1e40af",
  });

  const fundCalc = await Course.create({
    name: "Fundamentos del Cálculo",
    code: "FUNCAL",
    description: "Álgebra, funciones, trigonometría, logaritmos y vectores.",
    cycle: "1",
    color: "#059669", // Verde para diferenciarlo
  });

  // ==========================================
  // TEMAS PARA FUNDAMENTOS DEL CÁLCULO (Basado en tus PDFs)
  // ==========================================
  console.log("📖 Creando semanas de Fundamentos del Cálculo...");
  
  const semanasFund = [
    { s: 1, name: "Semana 1: Funciones y Dominio", desc: "Dominio, rango, composición de funciones y modelos (Simulacro)." },
    { s: 2, name: "Semana 2: Función Lineal y Cuadrática", desc: "Pendiente, vértice, máximos y mínimos aplicados (Simulacro)." },
    { s: 3, name: "Semana 3: Trigonometría Básica", desc: "Círculo unitario, identidades y ángulos de elevación (Tarea 5)." },
    { s: 4, name: "Semana 4: Funciones Trigonométricas", desc: "Amplitud, periodo, desfase y gráficas seno/coseno (Simulacro)." },
    { s: 5, name: "Semana 5: Función Exponencial", desc: "Crecimiento, decaimiento y modelo de vida media (Tarea 7)." },
    { s: 6, name: "Semana 6: Función Logarítmica", desc: "Propiedades de logaritmos, ecuaciones logarítmicas (ED4)." },
    { s: 7, name: "Semana 7: Ecuaciones Exponenciales", desc: "Resolución de ecuaciones exponenciales y aplicaciones (ED4)." },
    { s: 8, name: "Semana 8: Geometría Analítica", desc: "Circunferencias, parábolas, elipses e hipérbolas (ED5)." },
    { s: 9, name: "Semana 9: Vectores en 2D", desc: "Componentes, magnitud y dirección (Tarea 9)." },
    { s: 10, name: "Semana 10: Operaciones con Vectores", desc: "Producto punto, producto cruz y ángulos (ED6)." },
    { s: 11, name: "Semana 11: Aplicaciones de Vectores", desc: "Fuerzas en equilibrio, trayectorias y trabajo (Tarea 10)." },
  ];

  const topicsFund = [];

  for (let i = 0; i < semanasFund.length; i++) {
    const sem = semanasFund[i];
    const topic = await Topic.create({
      name: sem.name,
      description: sem.desc,
      course: fundCalc._id,
      order: sem.s
    });
    topicsFund.push(topic);
  }

  fundCalc.topics = topicsFund.map(t => t._id);
  await fundCalc.save();

  // ==========================================
  // TÉCNICAS DE ESTUDIO Y QUIZZES (Solo 1 técnica y 1 quiz por semana para no saturar)
  // ==========================================
  console.log("🧠 Creando técnicas y autoevaluaciones...");

  const tecnicasRotativas = [
    { title: "Active Recall", type: "active-recall", desc: "Usa tarjetas para memorizar las propiedades y fórmulas.", steps: ["Haz tarjetas", "Pregúntate", "Repasa lo fallado"] },
    { title: "Técnica Feynman", type: "feynman", desc: "Explica el concepto en voz alta para detectar vacíos.", steps: ["Escribe el concepto", "Explícalo simple", "Mejora"] },
    { title: "Resolución de Problemas", type: "problem-solving", desc: "Resuelve ejercicios cronometrados.", steps: ["Lee el problema", "Identifica datos", "Resuelve"] }
  ];

  for (let i = 0; i < topicsFund.length; i++) {
    const topic = topicsFund[i];
    
    // 1. Crear la técnica de estudio
    const tech = tecnicasRotativas[i % 3];
    await StudyTechnique.create({
      title: tech.title,
      description: tech.desc,
      steps: tech.steps,
      type: tech.type,
      course: fundCalc._id,
      topic: topic._id,
      estimatedMinutes: 20
    });

    // 2. Crear el Quiz de prueba
    const quiz = await Quiz.create({
      title: `Quiz Rápido: ${topic.name.split(': ')[1]}`,
      description: `Pon a prueba tu comprensión sobre este tema.`,
      topic: topic._id,
      course: fundCalc._id,
      difficulty: "intermedio",
      estimatedMinutes: 5,
    });

    // Preguntas de ejemplo basadas en tus PDFs
    let statement = "¿Cuál es el concepto clave de esta semana?";
    let options = ["Memorizar fórmulas", "Comprender la lógica y aplicación", "Adivinar", "Ninguna"];
    let correctIndex = 1;
    let explanation = "En Fundamentos del Cálculo, entender la lógica es más importante que memorizar.";

    if (i === 2) { // Semana 3: Trigonometría
      statement = "Si el ángulo de elevación a una torre a 100m es de 50°, ¿qué función usarías para hallar la altura?";
      options = ["Seno", "Coseno", "Tangente", "Secante"];
      correctIndex = 2;
      explanation = "La tangente relaciona el cateto opuesto (altura) con el adyacente (distancia).";
    } else if (i === 8) { // Semana 9: Vectores
      statement = "Dado el vector v = <3, 4>, ¿cuál es su magnitud?";
      options = ["7", "5", "1", "25"];
      correctIndex = 1;
      explanation = "La magnitud se calcula con el teorema de Pitágoras: √(3² + 4²) = 5.";
    }

    const q1 = await Question.create({
      quiz: quiz._id,
      statement: `[Semana ${i+1}] ${statement}`,
      options: options,
      correctIndex: correctIndex,
      explanation: explanation,
      order: 1
    });

    quiz.questions = [q1._id];
    await quiz.save();
  }

  console.log("\nSeed completado con éxito");
  console.log("Se crearon los cursos: Cálculo 1 y Fundamentos del Cálculo (con 11 semanas).");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Error en seed:", err);
  process.exit(1);
});