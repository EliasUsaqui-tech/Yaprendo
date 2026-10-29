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
  await User.create([
    { name: "Admin UTEC", email: "admin@utec.edu.pe", password: "admin123", cycle: "egresado", role: "admin" },
    { name: "Leonardo Autodidacta", email: "leonardo@utec.edu.pe", password: "leonardo123", cycle: "1", role: "student" },
    { name: "Andrea Mentor", email: "andrea@utec.edu.pe", password: "andrea123", cycle: "6", role: "mentor", bio: "Estudiante de 6to ciclo, me gusta explicar con ejemplos prácticos.", expertise: ["Cálculo 1", "Física 1"] }
  ]);

  console.log("Creando cursos...");
  const calc1 = await Course.create({
    name: "Cálculo 1",
    code: "CAL1",
    description: "Límites, derivadas e introducción a integrales basados en el sílabo CC1101 (Malla 2021).",
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

  console.log("📖 Creando las 16 semanas de Cálculo 1...");
  
  const semanas = [
    { s: 1, name: "Semana 1: Funciones y Modelos", desc: "Definición, notación, dominio, rango y transformaciones geométricas." },
    { s: 2, name: "Semana 2: Tipos de Funciones", desc: "Funciones constante, lineal, cuadrática, polinómica y potencia." },
    { s: 3, name: "Semana 3: Funciones Especiales", desc: "Exponenciales, logarítmicas, hiperbólicas, seno y coseno." },
    { s: 4, name: "Semana 4: Límites y Continuidad", desc: "Asíntotas, límites laterales, límites al infinito y continuidad." },
    { s: 5, name: "Semana 5: Definición de Derivada", desc: "Tasa de cambio, pendiente de tangente y Teorema del Valor Medio." },
    { s: 6, name: "Semana 6: Reglas de Derivación", desc: "Derivadas básicas, regla de la cadena y derivación implícita." },
    { s: 7, name: "Semana 7: Aplicaciones de la Derivada", desc: "Optimización, crecimiento, concavidad y puntos críticos." },
    { s: 8, name: "Semana 8: Diferenciales", desc: "Notación de Leibniz y cálculo de diferenciales." },
    { s: 9, name: "Semana 9: Velocidades Relacionadas", desc: "Problemas de contexto real con diferenciales y antiderivadas." },
    { s: 10, name: "Semana 10: Repaso y Problemas", desc: "Problemas integradores de funciones, derivadas y tasas de cambio." },
    { s: 11, name: "Semana 11: Integrales Indefinidas", desc: "Sustitución, integración por partes y fracciones parciales." },
    { s: 12, name: "Semana 12: Sumas de Riemann", desc: "Estimación de área bajo la curva mediante rectángulos." },
    { s: 13, name: "Semana 13: Integral Definida", desc: "Teoremas fundamentales del cálculo." },
    { s: 14, name: "Semana 14: Áreas y Valor Promedio", desc: "Cálculo de áreas entre curvas y aplicación de integrales." },
    { s: 15, name: "Semana 15: Ecuaciones Diferenciales", desc: "Método de separación de variables (Ley de enfriamiento, etc.)." },
    { s: 16, name: "Semana 16: Repaso Final", desc: "Evaluación integradora de todos los conceptos del curso." },
  ];

  const topicosCreados = [];

  for (let i = 0; i < semanas.length; i++) {
    const sem = semanas[i];
    const topic = await Topic.create({
      name: sem.name,
      description: sem.desc,
      course: calc1._id,
      order: sem.s
    });
    topicosCreados.push(topic);
  }

  const tCinematica = await Topic.create({ name: "Cinemática", description: "MRU, MRUV y caída libre.", course: fisica._id, order: 1 });

  calc1.topics = topicosCreados.map(t => t._id);
  fisica.topics = [tCinematica._id];
  await Promise.all([calc1.save(), fisica.save()]);

  console.log("🧠 Creando las 4 técnicas de estudio base...");
  
  await StudyTechnique.create([
    {
      title: "Técnica Feynman",
      description: "Explica el concepto como si se lo enseñaras a un niño de 12 años. Detecta vacíos al instante.",
      steps: ["Escribe el concepto", "Explícalo simple", "Identifica dónde te trabas", "Simplifica"],
      type: "feynman",
      course: calc1._id,
      estimatedMinutes: 20,
    },
    {
      title: "Active Recall con tarjetas",
      description: "Crea tarjetas con preguntas y respóndelas sin mirar apuntes. Fuerza a tu cerebro a recordar.",
      steps: ["Divide el tema", "Crea preguntas", "Responde sin mirar", "Repite las falladas"],
      type: "active-recall",
      course: calc1._id,
      estimatedMinutes: 25,
    },
    {
      title: "Resolución de Problemas",
      description: "La práctica hace al maestro. Resuelve ejercicios cronometrados para simular el examen.",
      steps: ["Lee el problema", "Identifica datos", "Plantea la solución", "Verifica tu respuesta"],
      type: "problem-solving",
      course: calc1._id,
      estimatedMinutes: 45,
    },
    {
      title: "Técnica Pomodoro",
      description: "Estudia en bloques de 25 minutos con 5 de descanso. Ideal para mantener la concentración.",
      steps: ["Elige una tarea", "Estudia 25 min", "Descansa 5 min", "Repite cada 4 ciclos toma un descanso largo"],
      type: "pomodoro",
      course: calc1._id,
      estimatedMinutes: 25,
    }
  ]);

  console.log("📝 Creando autoevaluaciones (Una por cada semana)...");
  
  for (let i = 0; i < topicosCreados.length; i++) {
    const topic = topicosCreados[i];
    
    // Creamos un Quiz por semana
    const quiz = await Quiz.create({
      title: `Quiz Rápido: ${topic.name.split(': ')[1]}`,
      description: `Comprueba tu comprensión de la ${topic.name}.`,
      topic: topic._id,
      course: calc1._id,
      difficulty: i < 5 ? "basico" : (i < 10 ? "intermedio" : "avanzado"),
      estimatedMinutes: 5,
    });

    // Agregamos 1 pregunta de ejemplo
    const q1 = await Question.create({
      quiz: quiz._id,
      statement: `[Pregunta de prueba] ¿Cuál es el concepto principal de la ${topic.name}?`,
      options: ["Aplicar fórmulas memorizadas", "Comprender el análisis matemático", "Resolver problemas sin lógica", "Ninguna de las anteriores"],
      correctIndex: 1,
      explanation: "El curso busca desarrollar capacidades de razonamiento y modelación, no solo memorización.",
      order: 1
    });

    quiz.questions = [q1._id];
    await quiz.save();
  }

  console.log("\nSeed completado con éxito");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Error en seed:", err);
  process.exit(1);
});