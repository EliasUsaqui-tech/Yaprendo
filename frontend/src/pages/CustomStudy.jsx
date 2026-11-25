import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import api from "../services/api";
import pdfToText from "react-pdftotext";
import rehypeRaw from "rehype-raw";
import { getActiveTechniqueType } from "../utils/technique";

export default function CustomStudy() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Contexto recibido desde el quiz ("Practicar este tema", MVP V2)
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ctx = {
    courseId: params.get("courseId") || "",
    course: params.get("course") || "",
    topicId: params.get("topicId") || "",
    topic: params.get("topic") || "",
    score: params.get("score") || "",
  };
  const [topicContent, setTopicContent] = useState("");

  useEffect(() => {
    if (!ctx.topicId) return;
    api.get(`/courses/topics/${ctx.topicId}`)
      .then((r) => setTopicContent(r.data?.content || ""))
      .catch(() => setTopicContent(""));
  }, [ctx.topicId]);

  // 1. Obtenemos la técnica del test y la traducimos
  const techFromTest = getActiveTechniqueType(); // misma técnica que usa el resto de la app
  
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

  const requestSession = async (materialText) => {
    const response = await api.post("/auth/ai/custom-session", {
      materialText,
      technique: selectedTechnique,
      detailLevel,
      courseName: ctx.course,
      topicName: ctx.topic,
    });
    setResult(response.data);
  };

  // Lógica dinámica: cortamos el texto según la profundidad elegida
  const charLimitFor = (level) => (level === "resumido" ? 3000 : level === "completo" ? 8000 : 12000);

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

      await requestSession(extractedText.slice(0, charLimitFor(detailLevel)));
    } catch (err) {
      console.error(err);
      setError(err.message || "Hubo un error al procesar tu archivo. Intenta con otro PDF.");
    } finally {
      setLoading(false);
    }
  };

  // Práctica directa del tema evaluado, sin necesidad de subir un PDF
  const handleGenerateFromTopic = async () => {
    setLoading(true);
    setError("");
    try {
      const material = `Curso: ${ctx.course}\nTema: ${ctx.topic}\n\n${topicContent || "(Sin resumen cargado: usa el temario estándar del tema.)"}`;
      await requestSession(material);
    } catch (err) {
      console.error(err);
      setError("No se pudo generar la práctica del tema. Intenta nuevamente en unos segundos.");
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

      {ctx.topic && !result && (
        <div className="card bg-blue-950/60 border-blue-800 mb-6">
          <p className="text-sm text-blue-200 font-semibold mb-1">Práctica sugerida desde tu autoevaluación</p>
          <p className="text-sm text-slate-300 mb-4">
            Curso: <strong>{ctx.course}</strong> · Tema: <strong>{ctx.topic}</strong>
            {ctx.score && <> · Resultado: <strong>{ctx.score}%</strong></>}
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={handleGenerateFromTopic}
              disabled={loading}
              className={`btn-primary px-6 py-2 ${loading ? "opacity-50" : ""}`}
            >
              {loading ? "Generando..." : `✨ Practicar este tema con ${selectedTechnique}`}
            </button>
            <button
              onClick={() => navigate(`/mentors?${new URLSearchParams({ course: ctx.course, topic: ctx.topic, score: ctx.score })}`)}
              className="btn-secondary px-6 py-2"
            >
              🤝 Prefiero hablar con un mentor
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3">También puedes subir el PDF de tu clase abajo para una guía basada en tu propio material.</p>
        </div>
      )}

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
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setResult(null)} className="text-sm text-blue-400 hover:underline">
              ← Generar otra sesión
            </button>
            {ctx.courseId && (
              <button onClick={() => navigate(`/courses/${ctx.courseId}`)} className="text-sm text-blue-400 hover:underline">
                Volver al curso
              </button>
            )}
            <button onClick={() => navigate("/progress")} className="text-sm text-blue-400 hover:underline">
              Ver mi progreso →
            </button>
          </div>

          <div className="card bg-slate-900 border-slate-700">
            <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
              📖 Guía de Estudio ({selectedTechnique})
            </h2>
            
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 overflow-x-auto">
              <ReactMarkdown 
                remarkPlugins={[remarkMath, remarkGfm]} 
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                  // TRUCO: Limpiamos las etiquetas HTML si la IA las llegara a escribir
                  p: ({ node, ...props }) => {
                    if (typeof props.children === 'string') {
                      const cleanText = props.children
                        .replace(/<ul>/g, '\n')
                        .replace(/<\/ul>/g, '\n')
                        .replace(/<li>/g, '\n- ')
                        .replace(/<\/li>/g, '');
                      return <p className="mb-4 whitespace-pre-wrap leading-relaxed" {...props}>{cleanText}</p>;
                    }
                    return <p className="mb-4 whitespace-pre-wrap leading-relaxed" {...props} />;
                  },
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