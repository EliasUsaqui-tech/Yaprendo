import axios from "axios";

export const chatWithAI = async (req, res, next) => {
  try {
    const { topicName, techniqueName, history, userMessage } = req.body;

    // Armamos el contexto inicial (System Prompt)
    const systemPrompt = `Eres un tutor académico de UTEC. El estudiante está viendo el tema "${topicName}" y quiere ayuda aplicando la técnica de estudio "${techniqueName}". Responde de forma breve, clara y motivadora. Usa Markdown y LaTeX para matemáticas si es necesario.`;

    // Formateamos el historial para la API de Groq
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...history.map(msg => ({ role: msg.role, content: msg.content })),
      { role: "user", content: userMessage }
    ];

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: formattedMessages,
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    next(new Error("Error en el chat de IA"));
  }
};