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
  await Promise.all([
    Course.deleteMany(),
    Topic.deleteMany(),
    StudyTechnique.deleteMany(),
    Quiz.deleteMany(),
    Question.deleteMany(),
  ]);

  console.log("Verificando usuarios de prueba...");
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
    await User.create({ name: "Andrea Mentor", email: "andrea@utec.edu.pe", password: "andrea123", cycle: "6", role: "mentor", bio: "Estudiante de 6to ciclo.", expertise: ["Cálculo 1", "Fundamentos del Cálculo"] });
  }

  console.log("Creando cursos...");
  const calc1 = await Course.create({ name: "Cálculo 1", code: "CAL1", description: "Límites, derivadas e integrales.", cycle: "1", color: "#1e40af" });
  const fundCalc = await Course.create({ name: "Fundamentos del Cálculo", code: "FUNCAL", description: "Álgebra, trigonometría, logaritmos y vectores.", cycle: "1", color: "#059669" });
  const fisica = await Course.create({ name: "Física 1", code: "FIS1", description: "Cinemática, dinámica y leyes de Newton.", cycle: "1", color: "#dc2626" });

  // Cálculo 1
  const semanasCalc = ["Semana 1: Funciones y Modelos", "Semana 2: Tipos de Funciones", "Semana 3: Funciones Especiales", "Semana 4: Límites y Continuidad", "Semana 5: Definición de Derivada", "Semana 6: Reglas de Derivación", "Semana 7: Aplicaciones de la Derivada", "Semana 8: Diferenciales", "Semana 9: Velocidades Relacionadas", "Semana 10: Repaso y Problemas", "Semana 11: Integrales Indefinidas", "Semana 12: Sumas de Riemann", "Semana 13: Integral Definida", "Semana 14: Áreas y Valor Promedio", "Semana 15: Ecuaciones Diferenciales", "Semana 16: Repaso Final"];
  const topicsCalc = [];
  for (let i = 0; i < semanasCalc.length; i++) {
    const topic = await Topic.create({ name: semanasCalc[i], description: "Tema del sílabo.", course: calc1._id, order: i + 1 });
    topicsCalc.push(topic);
  }
  calc1.topics = topicsCalc.map(t => t._id);
  await calc1.save();

  // Fundamentos del Cálculo (11 Semanas con formato Markdown/LaTeX)
  console.log("📖 Creando semanas de Fundamentos del Cálculo...");
  
  const semanasFundConTeoria = [
    { 
      s: 1, 
      name: "Semana 1: Funciones y Dominio", 
      desc: "Dominio, rango, composición y modelos.",
      content: "Una función es una regla que asigna a cada valor de x (dominio) un único valor de y (rango).\n\n**Conceptos clave:**\n1. **Dominio:** Valores de x permitidos. Si hay raíz cuadrada, lo de adentro debe ser mayor o igual a 0 ($\\ge 0$). Si hay logaritmo, debe ser mayor que 0 ($> 0$).\n2. **Composición ($f \\circ g$):** Significa evaluar $g(x)$ y meter ese resultado en $f(x)$.\n\n**Ejemplo de examen:** Para $f(x) = \\ln(4-x)$ y $g(x) = \\sqrt{3x+6}$, el dominio de $f$ es $x < 4$ y el de $g$ es $x \\ge -2$."
    },
    { 
      s: 2, 
      name: "Semana 2: Función Lineal y Cuadrática", 
      desc: "Pendiente, vértice, máximos y mínimos.",
      content: "**Función Lineal ($y = mx + b$):** La pendiente $m$ indica la tasa de cambio constante.\n\n**Función Cuadrática ($y = ax^2 + bx + c$):** Su gráfica es una parábola.\n- Si $a > 0$, abre hacia arriba.\n- Si $a < 0$, abre hacia abajo.\n\n**El Vértice:** Se calcula con la fórmula: \n$$t = -\\frac{b}{2a}$$\n\n**Ejemplo:** En $E(t) = 0.8t^2 - 6t + 25$, el vértice está en $t = 3.75$."
    },
    { 
      s: 3, 
      name: "Semana 3: Trigonometría Básica", 
      desc: "Círculo unitario, identidades y ángulos de elevación.",
      content: "**Identidad Pitagórica:** Es la base para resolver muchas ecuaciones:\n$$\\sin^2(\\theta) + \\cos^2(\\theta) = 1$$\n\n**Ángulos de Elevación:** Si tienes el cateto opuesto (altura) y el adyacente (distancia), usas la **Tangente**:\n$$\\tan(\\theta) = \\frac{\\text{Opuesto}}{\\text{Adyacente}}$$\n\n**Ejemplo de examen:** Si el ángulo es $50^\\circ$ y la distancia es $100m$, la altura es $h = 100 \\cdot \\tan(50^\\circ) \\approx 160m$."
    },
    { 
      s: 4, 
      name: "Semana 4: Funciones Trigonométricas", 
      desc: "Amplitud, periodo, desfase y gráficas.",
      content: "Para la función general $G(x) = A \\cos(B(x - C)) + D$:\n- **Amplitud ($A$):** $|A|$.\n- **Periodo:** $\\frac{2\\pi}{|B|}$.\n- **Desfase ($C$):** Desplazamiento horizontal.\n- **Desplazamiento vertical ($D$):** Hacia arriba o abajo."
    },
    { 
      s: 5, 
      name: "Semana 5: Función Exponencial", 
      desc: "Crecimiento, decaimiento y vida media.",
      content: "Una función exponencial tiene la forma $f(t) = A e^{kt}$.\n- Si $k > 0$, hay **crecimiento**.\n- Si $k < 0$, hay **decaimiento**.\n\n**Vida Media:** La constante $k$ se calcula como $k = \\frac{\\ln(2)}{\\text{vida media}}$.\n\n**Ejemplo:** $C(t) = 40e^{-0.18t} + 5$, su concentración inicial ($t=0$) es $45$ mg/L."
    },
    { 
      s: 6, 
      name: "Semana 6: Función Logarítmica", 
      desc: "Propiedades de logaritmos y ecuaciones.",
      content: "El logaritmo es la inversa de la exponencial: $\\log_b(x) = y \\iff b^y = x$.\n\n**Propiedades clave:**\n- $\\log(a \\cdot b) = \\log(a) + \\log(b)$\n- $\\log\\left(\\frac{a}{b}\\right) = \\log(a) - \\log(b)$\n- $\\log(a^n) = n \\log(a)$\n\n**Ejemplo de examen:** $\\log_3(x+1) + \\log_3(x-5) = 2$ se convierte en $(x+1)(x-5) = 3^2$."
    },
    { 
      s: 7, 
      name: "Semana 7: Ecuaciones Exponenciales", 
      desc: "Resolución y aplicaciones.",
      content: "Para resolver ecuaciones con exponenciales, busca igualar las bases o usar **cambio de variable**.\n\n**Ejemplo de examen:** $9^x - 10(3^x) + 9 = 0$.\nComo $9^x = (3^x)^2$, hacemos $u = 3^x$. La ecuación se vuelve $u^2 - 10u + 9 = 0$."
    },
    { 
      s: 8, 
      name: "Semana 8: Geometría Analítica", 
      desc: "Cónicas: circunferencia, parábola, elipse.",
      content: "**Identificar cónicas:** Mira los coeficientes de $x^2$ e $y^2$.\n- **Circunferencia:** Coeficientes iguales y del mismo signo.\n- **Parábola:** Solo una variable está al cuadrado.\n- **Elipse:** Coeficientes distintos pero positivos.\n\n**Completar cuadrados:** Técnica para hallar el centro y radio."
    },
    { 
      s: 9, 
      name: "Semana 9: Vectores en 2D", 
      desc: "Componentes, magnitud y dirección.",
      content: "Un vector tiene **magnitud** (longitud) y **dirección** (ángulo).\n\n**Magnitud de $v = \\langle x, y \\rangle$:** Se calcula con el teorema de Pitágoras:\n$$|v| = \\sqrt{x^2 + y^2}$$\n\n**Vector unitario:** $\\hat{u} = \\frac{v}{|v|}$.\n\n**Ejemplo:** Si $v = \\langle 3, 4 \\rangle$, su magnitud es $5$ y su vector unitario es $\\langle 0.6, 0.8 \\rangle$."
    },
    { 
      s: 10, 
      name: "Semana 10: Operaciones con Vectores", 
      desc: "Producto punto, producto cruz y ángulos.",
      content: "**Producto Punto ($A \\cdot B$):** Multiplicas componentes iguales y sumas. Si $A = \\langle 2, 3 \\rangle$ y $B = \\langle 4, -1 \\rangle$, entonces $A \\cdot B = (2)(4) + (3)(-1) = 5$.\n\n**Ángulo entre vectores:** Si el producto punto es 0, son **perpendiculares**.\n$$A \\cdot B = |A| |B| \\cos(\\theta)$$"
    },
    { 
      s: 11, 
      name: "Semana 11: Aplicaciones de Vectores", 
      desc: "Equilibrio de fuerzas y trayectorias.",
      content: "En física, si un objeto está en **equilibrio**, la suma de todas las fuerzas es cero: **$\\Sigma F = 0$**.\n\nPara resolver problemas de fuerzas:\n1. Descompones cada fuerza en sus componentes X e Y.\n2. Sumas todas las X y las igualas a 0.\n3. Sumas todas las Y y las igualas a 0.\n4. Resuelves el sistema."
    },
  ];

  const topicsFund = [];
  for (let i = 0; i < semanasFundConTeoria.length; i++) {
    const sem = semanasFundConTeoria[i];
    const topic = await Topic.create({ 
      name: sem.name, 
      description: sem.desc, 
      content: sem.content, 
      course: fundCalc._id, 
      order: sem.s 
    });
    topicsFund.push(topic);
  }
  fundCalc.topics = topicsFund.map(t => t._id);
  await fundCalc.save();

  // Física
  const tCinematica = await Topic.create({ name: "Cinemática", description: "MRU, MRUV y caída libre.", course: fisica._id, order: 1 });
  fisica.topics = [tCinematica._id];
  await fisica.save();

  // Técnicas
  console.log("🧠 Creando técnicas...");
  await StudyTechnique.create([
    { title: "Técnica Feynman", description: "Explica el concepto de forma simple.", steps: ["Escribe", "Explica", "Detecta vacíos", "Simplifica"], type: "feynman", course: calc1._id, estimatedMinutes: 20 },
    { title: "Active Recall", description: "Usa tarjetas para recordar.", steps: ["Divide", "Pregunta", "Responde", "Repite"], type: "active-recall", course: calc1._id, estimatedMinutes: 25 },
    { title: "Resolución de Problemas", description: "Resuelve ejercicios cronometrados.", steps: ["Lee", "Identifica", "Plantea", "Verifica"], type: "problem-solving", course: calc1._id, estimatedMinutes: 45 },
    { title: "Técnica Pomodoro", description: "Estudia en bloques con descansos.", steps: ["Elige", "Estudia", "Descansa", "Repite"], type: "pomodoro", course: calc1._id, estimatedMinutes: 25 }
  ]);

  // ==========================================
  // QUIZZES DE FUNDAMENTOS (11 SEMANAS)
  // ==========================================
  console.log("📝 Creando autoevaluaciones para las 11 semanas de Fundamentos...");

  const fundQuizzesData = [
    { // Semana 1
      title: "Evaluación: Funciones y Dominio",
      qs: [
        { q: "Dadas f(x) = ln(4 - x) y g(x) = √(3x + 6), ¿cuál es el dominio de f(x)?", opts: ["x < 4", "x > 4", "x ≥ 4", "Todos los reales"], ans: 0, exp: "El argumento del logaritmo debe ser > 0: 4 - x > 0 → x < 4." },
        { q: "¿Cuál es el dominio de g(x) = √(3x + 6)?", opts: ["x > -2", "x ≥ -2", "x < -2", "x ≤ -2"], ans: 1, exp: "Lo que está dentro de la raíz debe ser ≥ 0: 3x + 6 ≥ 0 → x ≥ -2." },
        { q: "¿Cuál de las siguientes funciones NO es una función polinómica?", opts: ["f(x) = 3x² + 2x - 1", "f(x) = x⁵ - 4x³", "f(x) = 2/x + 3", "f(x) = 7"], ans: 2, exp: "f(x) = 2/x + 3 es una función racional porque la variable está en el denominador." },
        { q: "Si h(x) = (f/g)(x), ¿qué valor de x NO pertenece al dominio de h?", opts: ["x = 4", "x = -3", "x = -2", "x = 0"], ans: 2, exp: "x = -2 hace que el denominador g(x) sea 0, por lo que no está en el dominio." }
      ]
    },
    { // Semana 2
      title: "Evaluación: Función Lineal y Cuadrática",
      qs: [
        { q: "En la función P(t) = 40t + 120, ¿qué representa la pendiente 40?", opts: ["El valor inicial", "La tasa de cambio", "El máximo de la función", "El punto de corte con el eje Y"], ans: 1, exp: "La pendiente indica la tasa de cambio o la cantidad que aumenta por cada unidad de tiempo." },
        { q: "Dada la función cuadrática E(t) = 0.8t² - 6t + 25, ¿cómo se calcula el vértice?", opts: ["t = -b/2a", "t = -2a/b", "t = b² - 4ac", "t = -b"], ans: 0, exp: "La fórmula del vértice es t = -b/(2a)." },
        { q: "Si E(t) = 0.8t² - 6t + 25, ¿en qué valor de t se alcanza el mínimo?", opts: ["3.75", "2.5", "5", "7.5"], ans: 0, exp: "t = -(-6) / (2 * 0.8) = 6 / 1.6 = 3.75." },
        { q: "¿Qué indica el signo del coeficiente 'a' en una parábola?", opts: ["Si abre hacia arriba o abajo", "El vértice exacto", "La pendiente de la recta", "El desplazamiento horizontal"], ans: 0, exp: "Si a > 0, la parábola abre hacia arriba; si a < 0, abre hacia abajo." }
      ]
    },
    { // Semana 3
      title: "Evaluación: Trigonometría Básica",
      qs: [
        { q: "Desde un punto a 100 m de una torre, el ángulo de elevación a la punta es de 50°. ¿Qué función usarías para hallar la altura?", opts: ["Seno", "Coseno", "Tangente", "Secante"], ans: 2, exp: "La tangente relaciona el cateto opuesto (altura) con el adyacente (distancia)." },
        { q: "¿Cuál es la identidad pitagórica fundamental?", opts: ["sen²θ - cos²θ = 1", "sen²θ + cos²θ = 1", "tan²θ + 1 = cos²θ", "senθ + cosθ = 1"], ans: 1, exp: "La suma de los cuadrados del seno y coseno siempre es 1." },
        { q: "Si el sen(θ) = 0.6 y θ está en el primer cuadrante, ¿cuál es el valor de cos(θ)?", opts: ["0.8", "0.4", "1.2", "0"], ans: 0, exp: "Usando sen²θ + cos²θ = 1: 0.36 + cos²θ = 1 → cos²θ = 0.64 → cosθ = 0.8." },
        { q: "Si la torre mide 160 m y estás a 100 m, ¿cuál es el ángulo de elevación?", opts: ["45°", "58°", "60°", "30°"], ans: 1, exp: "tan(θ) = 160/100 = 1.6. Con arcotangente, θ ≈ 58°." }
      ]
    },
    { // Semana 4
      title: "Evaluación: Funciones Trigonométricas",
      qs: [
        { q: "En G(x) = -4 cos(π/6 (x + 2)) + 10, ¿cuál es la amplitud?", opts: ["4", "-4", "10", "π/6"], ans: 0, exp: "La amplitud es el valor absoluto del coeficiente: |-4| = 4." },
        { q: "En la misma función, ¿cuál es el desplazamiento vertical?", opts: ["-4", "2", "10", "π/6"], ans: 2, exp: "El desplazamiento vertical es el término independiente (+10)." },
        { q: "Si se cambia el coeficiente π/6 por π/3, ¿qué le pasa al periodo?", opts: ["Se duplica", "Se reduce a la mitad", "Se mantiene igual", "Se vuelve cero"], ans: 1, exp: "El periodo es 2π / (π/3) = 6, que es la mitad de 12 (el periodo anterior)." },
        { q: "¿Cuál es el periodo de la función sen(2x)?", opts: ["2π", "π", "π/2", "4π"], ans: 1, exp: "El periodo se calcula como 2π / |b|. Aquí b=2, por lo que el periodo es π." }
      ]
    },
    { // Semana 5
      title: "Evaluación: Función Exponencial",
      qs: [
        { q: "En la función C(t) = 40e^(-0.18t) + 5, ¿cuál es la concentración inicial?", opts: ["40", "45", "5", "0"], ans: 1, exp: "Al evaluar t=0, e^0 = 1, entonces C(0) = 40(1) + 5 = 45." },
        { q: "¿A qué valor tiende C(t) cuando t → ∞?", opts: ["0", "5", "40", "∞"], ans: 1, exp: "Cuando t crece, e^(-0.18t) tiende a 0, por lo que C(t) tiende a 5." },
        { q: "Si un material tiene una vida media de 5 días, ¿cuál es su constante de decaimiento k?", opts: ["k = ln(2)/5", "k = 5/ln(2)", "k = 5 * ln(2)", "k = 2/5"], ans: 0, exp: "La fórmula es k = ln(2) / vida_media." },
        { q: "¿Qué significa que el decaimiento sea exponencial?", opts: ["Que aumenta rápidamente", "Que se mantiene constante", "Que disminuye a una tasa proporcional a su valor", "Que se vuelve negativo"], ans: 2, exp: "En un decaimiento exponencial, la rapidez de disminución es proporcional a la cantidad presente en cada momento." }
      ]
    },
    { // Semana 6
      title: "Evaluación: Función Logarítmica",
      qs: [
        { q: "¿Cuál es el valor de log₂(8)?", opts: ["2", "3", "4", "8"], ans: 1, exp: "log₂(8) = 3 porque 2³ = 8." },
        { q: "Si log₃(x + 1) + log₃(x - 5) = 2, ¿qué propiedad se debe aplicar primero?", opts: ["Cambio de base", "Suma de logaritmos", "División de logaritmos", "Derivada"], ans: 1, exp: "La suma de logaritmos de igual base se convierte en el logaritmo del producto." },
        { q: "¿Cuál es el dominio de f(x) = log(x - 3)?", opts: ["x > 3", "x ≥ 3", "x < 3", "x ≠ 3"], ans: 0, exp: "El argumento del logaritmo debe ser mayor que cero: x - 3 > 0 → x > 3." },
        { q: "¿Cuál es la expresión equivalente a log(a/b)?", opts: ["log(a) + log(b)", "log(a) - log(b)", "log(a) * log(b)", "log(a) / log(b)"], ans: 1, exp: "El logaritmo de un cociente es igual a la diferencia de los logaritmos." }
      ]
    },
    { // Semana 7
      title: "Evaluación: Ecuaciones Exponenciales",
      qs: [
        { q: "Al resolver 9^x - 10(3^x) + 9 = 0, ¿qué cambio de variable es útil?", opts: ["u = 9^x", "u = 3^x", "u = x^3", "u = log(x)"], ans: 1, exp: "Como 9^x = (3^x)², se puede hacer u = 3^x para obtener una ecuación cuadrática." },
        { q: "Si 2e^x - 5e^(-x) = 3, ¿cuál es el primer paso?", opts: ["Multiplicar por e^x", "Dividir entre 2", "Aplicar logaritmo natural", "Derivar"], ans: 0, exp: "Al multiplicar todo por e^x, se obtiene una ecuación cuadrática en términos de e^x." },
        { q: "¿Cuál es la solución de 2^x = 32?", opts: ["x = 4", "x = 5", "x = 6", "x = 16"], ans: 1, exp: "32 = 2^5, por lo tanto x = 5." },
        { q: "¿Cuál es el valor de x en la ecuación e^(2x) = 10?", opts: ["x = ln(10)/2", "x = ln(5)", "x = 10/2", "x = ln(20)"], ans: 0, exp: "Aplicando ln a ambos lados: 2x = ln(10), por lo que x = ln(10)/2." }
      ]
    },
    { // Semana 8
      title: "Evaluación: Geometría Analítica",
      qs: [
        { q: "¿Qué tipo de curva representa la ecuación x² + y² - 6x + 4y - 12 = 0?", opts: ["Parábola", "Circunferencia", "Elipse", "Hipérbola"], ans: 1, exp: "Los coeficientes de x² e y² son iguales y tienen el mismo signo, lo que indica una circunferencia." },
        { q: "Completando cuadrados en x² + y² - 6x + 4y - 12 = 0, ¿cuál es el centro?", opts: ["(3, -2)", "(-3, 2)", "(-3, -2)", "(3, 2)"], ans: 0, exp: "Agrupando: (x-3)² + (y+2)² = 25. El centro es (3, -2)." },
        { q: "¿Cuál es el radio de la circunferencia anterior?", opts: ["5", "25", "12", "√12"], ans: 0, exp: "La ecuación queda igualada a 25, y como r² = 25, entonces r = 5." },
        { q: "¿Qué curva representa y² - 8x + 6y + 1 = 0?", opts: ["Circunferencia", "Parábola horizontal", "Parábola vertical", "Elipse"], ans: 1, exp: "Solo tiene un término cuadrático (y²), lo que la convierte en una parábola que abre horizontalmente." }
      ]
    },
    { // Semana 9
      title: "Evaluación: Vectores en 2D",
      qs: [
        { q: "Dado el vector u = <3, 4>, ¿cuál es su magnitud?", opts: ["7", "5", "1", "25"], ans: 1, exp: "La magnitud es √(3² + 4²) = √(9 + 16) = √25 = 5." },
        { q: "Sea A = 3i + 4j. ¿Cuál es su vector unitario?", opts: ["<3, 4>", "<0.6, 0.8>", "<1, 1>", "<4, 3>"], ans: 1, exp: "El vector unitario se obtiene dividiendo entre la magnitud: <3/5, 4/5> = <0.6, 0.8>." },
        { q: "Dado el vector v = <-5, 2>, ¿cuál es su magnitud aproximada?", opts: ["3", "5.38", "7", "10"], ans: 1, exp: "La magnitud es √((-5)² + 2²) = √(25 + 4) = √29 ≈ 5.38." },
        { q: "Si un vector tiene componentes (0, -3), ¿cuál es su dirección respecto al eje x positivo?", opts: ["0°", "90°", "180°", "270°"], ans: 3, exp: "Apunta directamente hacia abajo, lo que corresponde a 270°." }
      ]
    },
    { // Semana 10
      title: "Evaluación: Operaciones con Vectores",
      qs: [
        { q: "Si el producto punto entre dos vectores es igual a 0, ¿qué se puede concluir?", opts: ["Son paralelos", "Son perpendiculares", "Son iguales", "Tienen la misma dirección"], ans: 1, exp: "El producto punto es cero cuando el ángulo entre ellos es de 90°, por lo que son ortogonales (perpendiculares)." },
        { q: "Dado A = <2, 3> y B = <4, -1>, ¿cuál es el producto punto A · B?", opts: ["5", "8", "11", "14"], ans: 0, exp: "A · B = (2)(4) + (3)(-1) = 8 - 3 = 5." },
        { q: "¿Qué representa geométricamente el producto cruz de dos vectores en 2D?", opts: ["Un vector perpendicular", "El área del paralelogramo", "La suma de sus magnitudes", "El ángulo entre ellos"], ans: 1, exp: "En 2D, la magnitud del producto cruz es el área del paralelogramo formado por los vectores." },
        { q: "Si A = <3, 0> y B = <0, 4>, ¿cuál es el ángulo entre ellos?", opts: ["0°", "45°", "90°", "180°"], ans: 2, exp: "A está sobre el eje x y B sobre el eje y, por lo que el ángulo entre ellos es de 90°." }
      ]
    },
    { // Semana 11
      title: "Evaluación: Aplicaciones de Vectores",
      qs: [
        { q: "Si un dron está en equilibrio, ¿cuál es la suma vectorial de todas las fuerzas que actúan sobre él?", opts: ["Es igual a su peso", "Es el vector nulo <0, 0>", "Es un vector infinito", "No se puede saber"], ans: 1, exp: "El equilibrio estático implica que la suma de todas las fuerzas es cero (vector nulo)." },
        { q: "En un problema de fuerzas, la descomposición rectangular permite:", opts: ["Calcular la longitud de la trayectoria", "Trabajar con componentes x e y por separado", "Eliminar el vector peso", "Cambiar la dirección del viento"], ans: 1, exp: "Descomponer un vector en sus componentes rectangulares permite sumar todas las fuerzas en X y todas en Y de manera independiente." },
        { q: "Si una fuerza F1 = <3, 4> y F2 = <2, -1>, ¿cuál es la fuerza resultante?", opts: ["<5, 3>", "<1, 5>", "<6, -4>", "<5, 5>"], ans: 0, exp: "Se suman las componentes: (3+2, 4+(-1)) = <5, 3>." },
        { q: "Una fuerza de 50 N a 270° (hacia abajo) tiene componentes:", opts: ["<50, 0>", "<0, 50>", "<0, -50>", "<-50, 0>"], ans: 2, exp: "A 270° apunta hacia abajo, por lo que su componente x es 0 y la y es negativa (-50)." }
      ]
    }
  ];

  // Iterar y crear los quizzes para Fundamentos del Cálculo
  for (let i = 0; i < topicsFund.length; i++) {
    const topic = topicsFund[i];
    const data = fundQuizzesData[i];
    
    const quiz = await Quiz.create({
      title: data.title,
      description: `Evalúa tus conocimientos sobre la ${topic.name}.`,
      topic: topic._id,
      course: fundCalc._id,
      difficulty: "intermedio",
      estimatedMinutes: 10,
    });

    const questionIds = [];
    for (let j = 0; j < data.qs.length; j++) {
      const qData = data.qs[j];
      const question = await Question.create({
        quiz: quiz._id,
        statement: qData.q,
        options: qData.opts,
        correctIndex: qData.ans,
        explanation: qData.exp,
        order: j + 1
      });
      questionIds.push(question._id);
    }

    quiz.questions = questionIds;
    await quiz.save();
    console.log(`  - Creado quiz: ${data.title}`);
  }

  // Quizzes genéricos para Cálculo 1
  for (let i = 0; i < topicsCalc.length; i++) {
    const topic = topicsCalc[i];
    const quiz = await Quiz.create({
      title: `Quiz Rápido: ${topic.name.split(': ')[1]}`,
      description: `Comprueba tu comprensión de la ${topic.name}.`,
      topic: topic._id,
      course: calc1._id,
      difficulty: "intermedio",
      estimatedMinutes: 5,
    });

    const q1 = await Question.create({
      quiz: quiz._id,
      statement: `¿Cuál es el concepto principal de la ${topic.name}?`,
      options: ["Aplicar fórmulas memorizadas", "Comprender el análisis matemático", "Resolver problemas sin lógica", "Ninguna de las anteriores"],
      correctIndex: 1,
      explanation: "El curso busca desarrollar capacidades de razonamiento y modelación, no solo memorización.",
      order: 1
    });

    quiz.questions = [q1._id];
    await quiz.save();
  }

  console.log("\nSeed completado con éxito.");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Error en seed:", err);
  process.exit(1);
});