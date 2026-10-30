import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import api from "../services/api";
import Loader from "../components/common/Loader";
import AIChat from "../components/ai/AIChat";

export default function TopicDetail() {
  const { id } = useParams(); // ID del tema
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [technique, setTechnique] = useState(null);
  const [allTechniques, setAllTechniques] = useState([]); // <-- Nuevo estado
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/courses/topics/${id}`).then(r => r.data).catch(() => null),
      api.get(`/techniques`).then(r => r.data), // <-- Traemos TODAS las técnicas
      api.get(`/quizzes?topic=${id}`).then(r => r.data)
    ])
      .then(([topicData, techData, quizData]) => {
        setTopic(topicData || { name: "Detalle del tema", description: "Estudiando...", content: "", course: "" }); 
        
        // Si hay técnicas, seleccionamos la primera por defecto
        if (techData && techData.length > 0) {
          setTechnique(techData[0]);
        }
        setAllTechniques(techData || []); // <-- Guardamos todas las técnicas
        
        setQuiz(quizData && quizData.length > 0 ? quizData[0] : null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-400 hover:underline mb-6 block">
        ← Volver al curso
      </button>

      <h1 className="text-3xl font-bold text-slate-100 mb-2">{topic?.name}</h1>
      <p className="text-slate-400 mb-8">{topic?.description}</p>

      <div className="space-y-6">
        
        {/* ====== TARJETA DE LA TÉCNICA RECOMENDADA ====== */}
        <div className="card bg-gradient-to-r from-purple-950 to-slate-900 border-purple-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🧠</span>
                <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider">
                  Técnica recomendada
                </h2>
              </div>
              
              {/* SELECTOR DE TÉCNICA */}
              <select 
                value={technique?._id || ""}
                onChange={(e) => {
                  const selected = allTechniques.find(t => t._id === e.target.value);
                  setTechnique(selected);
                }}
                className="bg-slate-900 border border-purple-700 text-purple-100 text-lg font-bold rounded-lg px-4 py-2 w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
              >
                {allTechniques.map(t => (
                  <option key={t._id} value={t._id}>{t.title}</option>
                ))}
              </select>

              {technique ? (
                <p className="text-sm text-slate-300 mt-2">{technique.description}</p>
              ) : (
                <p className="text-sm text-slate-400 mt-2">Selecciona una técnica.</p>
              )}
            </div>
            
            {technique && (
              <Link to="/techniques" className="btn-secondary text-xs whitespace-nowrap">
                Ver detalles
              </Link>
            )}
          </div>

          {technique?.steps && technique.steps.length > 0 && (
            <div className="mt-4 bg-slate-900/50 p-4 rounded-lg border border-purple-900/50">
              <p className="text-xs font-semibold text-purple-300 mb-2">¿Cómo aplicarla?</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-400">
                {technique.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">{i + 1}.</span> {step}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ====== RESUMEN TEÓRICO CON MARKDOWN ====== */}
        <div className="card bg-slate-900 border-slate-700">
          <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-700 pb-3">
            📖 Resumen del Tema
          </h2>
          {topic?.content ? (
            <div className="text-slate-300 text-sm leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ node, ...props }) => <p className="mb-4 whitespace-pre-wrap" {...props} />,
                  strong: ({ node, ...props }) => <strong className="text-slate-100 font-bold" {...props} />
                }}
              >
                {topic.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 italic">Aún no hay un resumen teórico subido para este tema.</p>
            </div>
          )}
        </div>

        {/* ====== TARJETA DE LA AUTOEVALUACIÓN ====== */}
        <div className="card bg-gradient-to-r from-blue-950 to-slate-900 border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-blue-200 mb-2 flex items-center justify-center md:justify-start gap-2">
              <span className="text-2xl">📝</span> Autoevaluación
            </h2>
            <p className="text-sm text-slate-300">
              Cuando termines de leer el resumen, pon a prueba tu comprensión real con este quiz corto.
            </p>
          </div>
          
          {quiz ? (
            <Link to={`/quiz/${quiz._id}`} className="btn-primary whitespace-nowrap px-8 py-3 w-full md:w-auto">
              Empezar Quiz
            </Link>
          ) : (
            <div className="bg-slate-800 p-3 rounded-lg text-center w-full md:w-auto">
              <p className="text-sm text-slate-500">No hay quiz disponible aún.</p>
            </div>
          )}
        </div>

      </div>

      {/* CHAT DE IA FLOTANTE */}
      <AIChat 
        key={technique?._id} // Reinicia el chat si cambia la técnica
        topicName={topic?.name} 
        techniqueName={technique?.title || "General"} 
        allTechniques={allTechniques} 
        onTechniqueChange={setTechnique} 
      />

    </div>
  );
}