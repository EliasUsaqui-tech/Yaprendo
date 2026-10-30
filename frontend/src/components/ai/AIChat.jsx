import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import api from "../../services/api";

export default function AIChat({ topicName, techniqueName, allTechniques, onTechniqueChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `¡Hola! Soy Cachimbo Bot. Veo que estás estudiando **${topicName}**. ¿En qué te puedo ayudar hoy?`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/auth/ai/chat", {
        topicName,
        techniqueName,
        history: messages,
        userMessage: input
      });
      
      setMessages((prev) => [...prev, { role: "assistant", content: response.data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Lo siento, tuve un problema de conexión. ¿Podemos intentarlo de nuevo?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Ventana del Chat */}
      {isOpen && (
        <div className="bg-slate-900 border border-purple-800 rounded-2xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden flex flex-col h-[500px]">
          
          {/* Header del Chat con Selector de Técnica */}
          <div className="bg-purple-900 p-4 flex flex-col gap-2 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <h3 className="font-bold text-sm">Cachimbo Bot</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-purple-300 hover:text-white">✕</button>
            </div>
            
            {/* Selector dentro del chat */}
            <div className="bg-purple-950/50 p-2 rounded-lg border border-purple-800/50">
              <label className="text-[10px] text-purple-300 uppercase font-bold mb-1 block">
                Cambiar técnica:
              </label>
              <select
                value={techniqueName || ""}
                onChange={(e) => {
                  const selected = allTechniques.find(t => t.title === e.target.value);
                  if (selected && onTechniqueChange) onTechniqueChange(selected);
                }}
                className="w-full bg-slate-950 border border-purple-700 text-white text-xs rounded p-1.5 focus:outline-none"
              >
                {allTechniques.map(t => (
                  <option key={t._id} value={t.title}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
                }`}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-400 p-3 rounded-xl rounded-bl-none text-xs italic animate-pulse">
                  Cachimbo Bot está escribiendo...
                </div>
              </div>
            )}
          </div>

          {/* Input para escribir */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hazle una pregunta..."
              className="flex-1 bg-slate-800 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition disabled:opacity-50">
              ➤
            </button>
          </form>
        </div>
      )}

      {/* Botón Flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition flex items-center gap-2 font-bold"
        >
          <span className="text-xl">🤖</span> Preguntar a Cachimbo Bot
        </button>
      )}
    </div>
  );
}