import { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import api from "../services/api";
import pdfToText from "react-pdftotext";

export default function CustomStudy() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 1. Obtenemos la técnica del test y la traducimos
  const techFromTest = localStorage.getItem("recommended_technique");
  
  const getTechniqueName = (tech) => {
    if (tech === "feynman") return "Feynman";
    if (tech === "active-recall") return "Active Recall";
    if (tech === "problem-solving") return "Resolución de Problemas";
    if (tech === "pomodoro") return "Pomodoro";
    return "Active Recall"; // Por defecto
  };

  const defaultTechnique = getTechniqueName(techFromTest);

  const [selectedTechnique, setSelectedTechnique] = useState(defaultTechnique);
  const [detailLevel, setDetailLevel] = useState("detallado");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleGenerate = async () => {
    if (!file) return setError("Por favor, sube un archivo PDF primero.");
    if (file.type !== "application/pdf") return setError("El archivo debe ser un PDF.");

    setLoading(true);
    setError("");

    try {
      const extractedText = await pdfToText(file);
      
      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error("El PDF no tiene suficiente texto o está escaneado como imagen.");
      }

      // LÓGICA DINÁMICA: Cortamos el texto según la profundidad elegida
      let charLimit = 12000; 
      if (detailLevel === "resumido") charLimit = 6000;
      if (detailLevel === "completo") charLimit = 25000;

      const response = await api.post("/auth/ai/custom-session", {
        materialText: extractedText.slice(0, charLimit), // <-- Aplicamos el límite
        technique: selectedTechnique,
        detailLevel: detailLevel
      });

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Hubo un error al procesar tu archivo. Intenta con otro PDF.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Mi Sesión Dinámica</h1>
        <p className="text-slate-400">Sube el PDF de tu clase y la IA creará una guía de estudio personalizada.</p>
      </div>

      {!result ? (
        <div className="card bg-slate-900 border-slate-700 text-center py-12">
          <span className="text-6xl mb-4 block">📄</span>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Sube tu material de clase</h2>
          
          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 text-sm p-3 rounded-lg mb-6 max-w-md mx-auto">
              {error}
            </div>
          )}

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full max-w-sm mx-auto mb-6 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
          />

          <div className="max-w-sm mx-auto mb-6 text-left">
            <label className="text-sm font-medium text-slate-300 block mb-2">Técnica a aplicar:</label>
            <select
              value={selectedTechnique}
              onChange={(e) => setSelectedTechnique(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded-lg p-2.5"
            >
              <option value="Feynman">Técnica Feynman</option>
              <option value="Active Recall">Active Recall</option>
              <option value="Resolución de Problemas">Resolución de Problemas</option>
              <option value="Pomodoro">Técnica Pomodoro</option>
            </select>
          </div>

          <div className="max-w-sm mx-auto mb-6 text-left">
            <label className="text-sm font-medium text-slate-300 block mb-2">Profundidad:</label>
            <select
              value={detailLevel}
              onChange={(e) => setDetailLevel(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded-lg p-2.5"
            >
              <option value="resumido">Resumido</option>
              <option value="detallado">Detallado</option>
              <option value="completo">Completo (Abarcar todo)</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !file}
            className={`btn-primary px-8 py-3 ${loading ? "opacity-50" : ""}`}
          >
            {loading ? "Procesando..." : "✨ Generar Sesión"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <button onClick={() => setResult(null)} className="text-sm text-blue-400 hover:underline">
            ← Subir otro archivo
          </button>

          <div className="card bg-slate-900 border-slate-700">
            <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
              📖 Guía de Estudio ({selectedTechnique})
            </h2>
            {/* Agregamos overflow-x-auto para que las fórmulas largas tengan scroll y no rompan el diseño */}
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 overflow-x-auto">
              <ReactMarkdown 
                remarkPlugins={[remarkMath, remarkGfm]} 
                rehypePlugins={[rehypeKatex]}
                components={{
                  // Mejorar el espaciado de los párrafos
                  p: ({ node, ...props }) => <p className="mb-4 whitespace-pre-wrap leading-relaxed" {...props} />,
                  // Darle estilo a las tablas generadas por la IA
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-6 rounded-lg border border-slate-700">
                      <table className="w-full text-left border-collapse text-sm" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => <th className="bg-slate-800 p-3 border-b border-slate-600 font-bold" {...props} />,
                  td: ({ node, ...props }) => <td className="p-3 border-b border-slate-700/50 align-top" {...props} />
                }}
              >
                {result.summary}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}