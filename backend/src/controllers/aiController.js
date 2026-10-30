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
        model: "llama-3.3-70b-versatile", // Modelo rápido y gratis
        messages: formattedMessages,
        temperature: 0.7, // Un poco de creatividad pero manteniendo la coherencia
        max_tokens: 500,
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