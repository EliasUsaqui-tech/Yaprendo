import axios from "axios";

// @route   POST /api/ai/chat
export const chatWithAI = async (req, res, next) => {
  try {
    const { topicName, techniqueName, history, userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ message: "El mensaje no puede estar vacío" });
    }

    // 1. Configuramos el "System Prompt" (la personalidad de la IA)
    const systemPrompt = `
      Eres un tutor académico experto de la Universidad de Ingeniería y Tecnología (UTEC).
      Un estudiante de primeros ciclos está estudiando el tema: "${topicName}".
      Actualmente está aplicando la técnica de estudio: "${techniqueName}".

      Tu objetivo es guiarlo usando esa técnica específica. 
      - Si es Feynman, pídele que te explique el concepto con sus propias palabras y señala los vacíos.
      - Si es Active Recall, no le des la respuesta de inmediato: hazle preguntas cortas y deja que intente recordar.
      - Si es Pomodoro, mantén respuestas breves y enfocadas en una sola tarea del bloque de 25 minutos.
      - Si es Resolución de Problemas, guíalo por pasos (datos, plan, solución, verificación) sin resolverle todo.
      - Sé motivador, breve y usa un tono amigable.
      - Si usas matemáticas, usa formato Markdown y LaTeX (ejemplo: $x^2$ o $$\\int x dx$$).
    `;

    // 2. Formateamos el historial de chat
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...history.map(msg => ({ role: msg.role, content: msg.content })),
      { role: "user", content: userMessage }
    ];

    // 3. Hacemos la petición a Groq (Modelo Llama 3)
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b", // Modelo rápido y gratis
        messages: formattedMessages,
        temperature: 0.7, // Un poco de creatividad pero manteniendo la coherencia
        max_tokens: 4000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Error en IA:", error.response?.data || error.message);
    next(new Error("Error al comunicarse con el Tutor IA"));
  }
};

// @route   POST /api/auth/ai/custom-session
export const generateCustomSession = async (req, res, next) => {
  try {
    const { materialText, technique, detailLevel, courseName, topicName } = req.body;

    if (!materialText) {
      return res.status(400).json({ message: "Falta el texto del material." });
    }

    // 1. Ajustamos las instrucciones según la profundidad
    let detailInstruction = "";
    let maxResponseTokens = 2000; // Por defecto

    if (detailLevel === "resumido") {
      detailInstruction = "Haz un resumen muy conciso. Ve directo al grano con los 3 o 4 conceptos más importantes.";
      maxResponseTokens = 1000;
    } else if (detailLevel === "completo") {
      detailInstruction = "Analiza TODO el material minuciosamente. Abarca cada subtema, fórmula y ejemplo.";
      maxResponseTokens = 1500; // Más espacio para responder
    } else {
      detailInstruction = "Haz una guía paso a paso balanceada. Explica los conceptos clave y da ejemplos prácticos.";
      maxResponseTokens = 1000;
    }

    const systemPrompt = `
      Eres un tutor experto de UTEC. Un alumno ha subido su material de clase.
      Debes generar una guía de estudio aplicando ESTRICTAMENTE la técnica de estudio: "${technique}".
      NIVEL DE PROFUNDIDAD REQUERIDO: ${detailInstruction}
      ${topicName ? `CONTEXTO: El alumno viene de una autoevaluación del tema "${topicName}" del curso ${courseName || ""}. Incluye al final 3 ejercicios de práctica con su solución oculta bajo un encabezado "Soluciones".` : ""}
      
      REGLAS ESTRICTAS DE FORMATO (OBLIGATORIO):
      1. Devuelve la respuesta en formato Markdown puro.
      2. PROHIBIDO usar etiquetas HTML (como <ul>, <li>, <b>, <br>). Usa Markdown en su lugar (ej. usa guiones "-" para listas y "**" para negritas).
      3. TODA EXPRESIÓN MATEMÁTICA DEBE IR ENTRE SIGNOS DE DÓLAR. No hay excepciones.
         - Para variables o fórmulas cortas en medio de una oración, usa un solo dólar: $O(n^2)$ o $n=1024$.
         - Para fórmulas grandes o despejadas en su propio párrafo, usa doble dólar: $$\\Theta(n^2)$$
      4. NUNCA escribas código LaTeX en texto plano (ej. NO escribas \\Theta o 3n^{2} sin los signos de dólar alrededor).
      5. Si generas una tabla Markdown, evita usar fórmulas LaTeX complejas dentro de las celdas para no romper la tabla.
      6. Sé claro, motivador y estructurado.
      7. La guía debe estar basada ÚNICAMENTE en el texto proporcionado.
    `;
    const userPrompt = `
      Aquí está el material de clase:
      ---
      ${materialText}
      ---
      Genera mi guía de estudio aplicando ${technique}.
    `;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: maxResponseTokens, // <-- Límite dinámico aplicado aquí
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ summary: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error en IA custom:", error.message);
    next(new Error("Error al generar la sesión personalizada"));
  }
};

// Llamada común a Groq (modelo openai/gpt-oss-120b)
const callGroq = async (systemPrompt, userPrompt, maxTokens = 1200) => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: maxTokens,
    },
    { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" } }
  );
  return response.data.choices[0].message.content;
};

// @route   POST /api/auth/ai/technique
// Actividades de práctica que dependen de la técnica elegida en el tema
export const techniqueActivity = async (req, res, next) => {
  try {
    const { mode, topicName = "", topicContent = "", studentText = "", problemText = "" } = req.body;
    const base = `Eres un tutor de UTEC para estudiantes de primer ciclo. Tema: "${topicName}".
Resumen oficial del tema (úsalo como referencia de lo correcto):
---
${String(topicContent).slice(0, 4000)}
---
Responde en español, en Markdown, con toda expresión matemática entre signos de dólar ($...$). Sé breve y motivador.`;

    const prompts = {
      feynman: [
        `${base}
El estudiante aplicó la Técnica Feynman: explicó el tema con sus palabras. Evalúa su explicación con esta estructura:
**Lo que explicaste bien** (2-3 viñetas), **Vacíos o errores** (2-3 viñetas, concretos), **Explicación más simple** (2-3 oraciones) y **Pregunta para seguir** (1 pregunta).`,
        `Mi explicación:\n${String(studentText).slice(0, 3000)}`,
      ],
      recall: [
        `${base}
El estudiante aplica Active Recall. Genera 5 preguntas cortas de recuerdo sobre el tema, numeradas, de menor a mayor dificultad. Después agrega un encabezado "Respuestas" con respuestas breves, para que las revise solo al final.`,
        "Genera mis preguntas de recuerdo.",
      ],
      problem: [
        `${base}
El estudiante aplica Resolución de Problemas. Plantea UN ejercicio tipo examen de dificultad media sobre el tema, con datos numéricos concretos. Muestra solo el enunciado: NO incluyas la solución.`,
        "Dame un ejercicio.",
      ],
      "problem-check": [
        `${base}
Corrige la solución del estudiante al ejercicio dado. Indica si el resultado es correcto, en qué paso (Datos, Plan, Solución o Verificación) se equivocó si hubo error, y muestra la solución correcta paso a paso.`,
        `Ejercicio:\n${String(problemText).slice(0, 2000)}\n\nMi solución:\n${String(studentText).slice(0, 3000)}`,
      ],
    };

    const prompt = prompts[mode];
    if (!prompt) return res.status(400).json({ message: "Modo de técnica no válido" });

    const reply = await callGroq(prompt[0], prompt[1]);
    res.json({ reply });
  } catch (error) {
    console.error("Error en IA técnica:", error.response?.data || error.message);
    next(new Error("Error al generar la actividad de la técnica"));
  }
};
