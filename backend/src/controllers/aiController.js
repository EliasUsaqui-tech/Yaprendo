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
      - Si es Feynman, pídele que te explique el concepto con sus propias palabras.
      - Si es Active Recall, hazle preguntas cortas sobre el tema.
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
    const { materialText, technique, detailLevel } = req.body;

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
      
      REGLAS ESTRICTAS DE FORMATO (OBLIGATORIO):
      1. Devuelve la respuesta en formato Markdown puro.
      2. TODA EXPRESIÓN MATEMÁTICA DEBE IR ENTRE SIGNOS DE DÓLAR. No hay excepciones.
         - Para variables o fórmulas cortas en medio de una oración, usa un solo dólar: $O(n^2)$ o $n=1024$.
         - Para fórmulas grandes o despejadas en su propio párrafo, usa doble dólar: $$\\Theta(n^2)$$
      3. NUNCA escribas código LaTeX en texto plano (ej. NO escribas \\Theta o 3n^{2} sin los signos de dólar alrededor).
      4. Si generas una tabla Markdown, evita usar fórmulas LaTeX complejas dentro de las celdas para no romper la tabla.
      5. Sé claro, motivador y estructurado.
      6. La guía debe estar basada ÚNICAMENTE en el texto proporcionado.
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