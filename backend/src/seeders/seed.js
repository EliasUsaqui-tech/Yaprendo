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

  console.log("Limpiando cursos, temas, técnicas y quizzes...");
  // NO borramos User.deleteMany() para no perder a los usuarios registrados
  await Promise.all([
    Course.deleteMany(),
    Topic.deleteMany(),
    StudyTechnique.deleteMany(),
    Quiz.deleteMany(),
    Question.deleteMany(),
  ]);

  console.log("Verificando usuarios de prueba...");
  // Solo creamos los usuarios si no existen en la base de datos
  const adminExists = await User.findOne({ email: "admin@utec.edu.pe" });
  if (!adminExists) {
    await User.create({ name: "Admin UTEC", email: "admin@utec.edu.pe", password: "admin123", cycle: "egresado", role: "admin" });
  }

  const leoExists = await User.findOne({ email: "leonardo@utec.edu.pe" });
  if (!leoExists) {
    await User.create({ name: "Leonardo Autodidacta", email: "leonardo@utec.edu.pe", password: "leonardo123", cycle: "1", role: "student" });
  }

  const andreaExists = await User.findOne({ email: "andrea@utec.edu.pe" });
  if (!andreaExists) {
    await User.create({ name: "Andrea Mentor", email: "andrea@utec.edu.pe", password: "andrea123", cycle: "6", role: "mentor", bio: "Estudiante de 6to ciclo, me gusta explicar con ejemplos prácticos.", expertise: ["Cálculo 1", "Fundamentos del Cálculo"] });
  }

  console.log("Creando cursos...");
  const calc1 = await Course.create({
    name: "Cálculo 1",
    code: "CAL1",
    description: "Límites, derivadas e introducción a integrales basados en el sílabo CC1101.",
    cycle: "1",
    color: "#1e40af",
  });

  const fundCalc = await Course.create({
    name: "Fundamentos del Cálculo",
    code: "FUNCAL",
    description: "Álgebra, trigonometría, logaritmos y vectores.",
    cycle: "1",
    color: "#059669",
  });

  const fisica = await Course.create({
    name: "Física 1",
    code: "FIS1",
    description: "Cinemática, dinámica y leyes de Newton.",
    cycle: "1",
    color: "#dc2626",
  });

  // ==========================================
  // CÁLCULO 1 (16 Semanas)
  // ==========================================
  console.log("📖 Creando las 16 semanas de Cálculo 1...");
  
  const semanasCalc = [
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

  const topicsCalc = [];
  for (let i = 0; i < semanasCalc.length; i++) {
    const sem = semanasCalc[i];
    const topic = await Topic.create({ name: sem.name, description: sem.desc, course: calc1._id, order: sem.s });
    topicsCalc.push(topic);
  }
  calc1.topics = topicsCalc.map(t => t._id);
  await calc1.save();

  // ==========================================
  // FUNDAMENTOS DEL CÁLCULO (11 Semanas)
  // ==========================================
  console.log("📖 Creando las semanas de Fundamentos del Cálculo...");
  
  const semanasFund = [
    { s: 1, name: "Semana 1: Funciones y Dominio", desc: "Dominio, rango, composición de funciones y modelos." },
    { s: 2, name: "Semana 2: Función Lineal y Cuadrática", desc: "Pendiente, vértice, máximos y mínimos aplicados." },
    { s: 3, name: "Semana 3: Trigonometría Básica", desc: "Círculo unitario, identidades y ángulos de elevación." },
    { s: 4, name: "Semana 4: Funciones Trigonométricas", desc: "Amplitud, periodo, desfase y gráficas seno/coseno." },
    { s: 5, name: "Semana 5: Función Exponencial", desc: "Crecimiento, decaimiento y modelo de vida media." },
    { s: 6, name: "Semana 6: Función Logarítmica", desc: "Propiedades de logaritmos y ecuaciones logarítmicas." },
    { s: 7, name: "Semana 7: Ecuaciones Exponenciales", desc: "Resolución de ecuaciones exponenciales y aplicaciones." },
    { s: 8, name: "Semana 8: Geometría Analítica", desc: "Circunferencias, parábolas, elipses e hipérbolas." },
    { s: 9, name: "Semana 9: Vectores en 2D", desc: "Componentes, magnitud y dirección." },
    { s: 10, name: "Semana 10: Operaciones con Vectores", desc: "Producto punto, producto cruz y ángulos." },
    { s: 11, name: "Semana 11: Aplicaciones de Vectores", desc: "Fuerzas en equilibrio, trayectorias y trabajo." },
  ];

  const topicsFund = [];
  for (let i = 0; i < semanasFund.length; i++) {
    const sem = semanasFund[i];
    const topic = await Topic.create({ name: sem.name, description: sem.desc, course: fundCalc._id, order: sem.s });
    topicsFund.push(topic);
  }
  fundCalc.topics = topicsFund.map(t => t._id);
  await fundCalc.save();

  // Física
  const tCinematica = await Topic.create({ name: "Cinemática", description: "MRU, MRUV y caída libre.", course: fisica._id, order: 1 });
  fisica.topics = [tCinematica._id];
  await fisica.save();

  // ==========================================
  // TÉCNICAS DE ESTUDIO
  // ==========================================
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

  // ==========================================
  // QUIZZES DE CÁLCULO 1
  // ==========================================
  console.log("📝 Creando autoevaluaciones para Cálculo 1...");
  
  for (let i = 0; i < topicsCalc.length; i++) {
    const topic = topicsCalc[i];
    const quiz = await Quiz.create({
      title: `Quiz Rápido: ${topic.name.split(': ')[1]}`,
      description: `Comprueba tu comprensión de la ${topic.name}.`,
      topic: topic._id,
      course: calc1._id,
      difficulty: i < 5 ? "basico" : (i < 10 ? "intermedio" : "avanzado"),
      estimatedMinutes: 5,
    });

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

  // ==========================================
  // QUIZZES DE FUNDAMENTOS DEL CÁLCULO (Basados en tus evaluaciones)
  // ==========================================
  console.log("📝 Creando autoevaluaciones para Fundamentos del Cálculo...");
  
  for (let i = 0; i < topicsFund.length; i++) {
    const topic = topicsFund[i];
    
    const quiz = await Quiz.create({
      title: `Quiz Rápido: ${topic.name.split(': ')[1]}`,
      description: `Pon a prueba tu comprensión sobre este tema.`,
      topic: topic._id,
      course: fundCalc._id,
      difficulty: "intermedio",
      estimatedMinutes: 5,
    });

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
  console.log("Se conservaron los usuarios existentes y se actualizaron los cursos.");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Error en seed:", err);
  process.exit(1);
});