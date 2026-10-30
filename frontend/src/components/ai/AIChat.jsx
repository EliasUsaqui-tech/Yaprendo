import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import api from "../../services/api";

export default function AIChat({ 
  topicName, 
  techniqueName, 
  allTechniques, 
  onTechniqueChange, 
  techColor = { border: "border-purple-500", bg: "bg-purple-900", text: "text-purple-300", gradient: "from-purple-600 to-blue-600" },
  onExpandChange 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); 
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
      setMessages((prev) => [...prev, { role: "assistant", content: "Lo siento, tuve un problema de conexión." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onExpandChange) onExpandChange(newState); 
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end transition-all duration-500 ease-in-out ${
      isExpanded ? 'w-full md:w-1/2 h-[calc(100vh-100px)]' : '' 
    }`}>
      {/* Ventana del Chat */}
      {isOpen && (
        <div className={`bg-slate-900 border ${techColor.border} rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${
          isExpanded ? 'w-full h-full mb-0' : 'w-80 md:w-96 mb-4 h-[500px]'
        }`}>
          
          {/* Header del Chat */}
          <div className={`p-4 flex flex-col gap-2 text-white transition-colors duration-500 ${techColor.bg} border-b ${techColor.border}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <h3 className="font-bold text-sm">Cachimbo Bot</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleExpand} 
                  className="text-white/70 hover:text-white px-2 py-1 bg-white/10 rounded transition"
                  title={isExpanded ? "Minimizar" : "Expandir a pantalla dividida"}
                >
                  {isExpanded ? "🗗" : "🗖"}
                </button>
                <button onClick={() => { setIsOpen(false); if (isExpanded) toggleExpand(); }} className="text-white/70 hover:text-white">✕</button>
              </div>
            </div>
            
            <div className="bg-black/20 p-2 rounded-lg border border-white/10">
              <label className="text-[10px] text-white/80 uppercase font-bold mb-1 block">
                Cambiar técnica:
              </label>
              <select
                value={techniqueName || ""}
                onChange={(e) => {
                  const selected = allTechniques.find(t => t.title === e.target.value);
                  if (selected && onTechniqueChange) onTechniqueChange(selected);
                }}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded p-1.5 focus:outline-none"
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
                  msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
                }`}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkMath, remarkGfm]} 
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          // Envolver la tabla en un div con scroll horizontal si es muy ancha
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto w-full my-4 rounded-lg border border-slate-700">
                              {/* w-full para que se adapte, min-w-[400px] para que no se aplaste en móviles */}
                              <table className="w-full min-w-[400px] text-left border-collapse text-xs" {...props} />
                            </div>
                          ),
                          // El texto baja de línea (break-words) en lugar de cortarse o estirar la tabla
                          th: ({ node, ...props }) => <th className="bg-slate-800 p-2 border-b border-slate-600 font-bold align-top break-words" {...props} />,
                          td: ({ node, ...props }) => <td className="p-2 border-b border-slate-700/50 align-top break-words" {...props} />
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (msg.content)}
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
              className="flex-1 bg-slate-800 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition disabled:opacity-50">
              ➤
            </button>
          </form>
        </div>
      )}

      {/* Botón Flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`bg-gradient-to-r ${techColor.gradient} text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-500 flex items-center gap-2 font-bold border ${techColor.border}`}
        >
          <span className="text-xl">🤖</span> Preguntar a Cachimbo Bot
        </button>
      )}
    </div>
  );
}