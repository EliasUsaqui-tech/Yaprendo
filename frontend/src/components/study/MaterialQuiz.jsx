import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import api from "../../services/api";

// Autoevaluación generada por IA a partir del material del propio estudiante.
// Hace que la ruta completa (practicar → autoevaluarse → siguiente paso) funcione con cualquier curso,
// no solo con los cursos piloto cargados en la plataforma.

const Md = ({ children }) => (
  <span className="[&_p]:inline">
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{children || ""}</ReactMarkdown>
  </span>
);

export default function MaterialQuiz({ materialText, subject, technique, onPractice, autoStart = false }) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  const generate = async () => {
    setLoading(true); setError(""); setSubmitted(false); setAnswers({}); setStarted(true);
    try {
      const { data } = await api.post("/auth/ai/material-quiz", { materialText, subject });
      if (!data.questions?.length) throw new Error("sin preguntas");
      setQuestions(data.questions);
    } catch {
      setError("No se pudo generar la autoevaluación. Intenta de nuevo en unos segundos.");
      setQuestions(null);
    } finally {
      setLoading(false);
    }
  };

  // Generación automática cuando el estudiante eligió "Autoevaluarme" directamente
  useEffect(() => {
    if (autoStart) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!started) {
    return (
      <div className="card bg-slate-900 border-slate-700 text-center">
        <h2 className="text-lg font-bold text-slate-100 mb-1">📝 ¿Ya lo dominas?</h2>
        <p className="text-sm text-slate-400 mb-4">Comprueba lo que aprendiste con una autoevaluación creada a partir de tu propio material.</p>
        <button onClick={generate} className="btn-primary px-6 py-2">Autoevaluarme con este material</button>
      </div>
    );
  }

  if (loading) {
    return <div className="card bg-slate-900 border-slate-700 text-center text-slate-300 py-10">Creando tu autoevaluación...</div>;
  }

  if (error || !questions) {
    return (
      <div className="card bg-slate-900 border-slate-700 text-center">
        <p className="text-sm text-red-300 mb-3">{error || "No se pudo generar la autoevaluación."}</p>
        <button onClick={generate} className="btn-secondary text-sm">Reintentar</button>
      </div>
    );
  }

  const correct = questions.filter((q, i) => answers[i] === q.correctIndex).length;
  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= 70;
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="card bg-slate-900 border-slate-700 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100">📝 Autoevaluación de tu material</h2>
        <p className="text-xs text-slate-400">{subject ? `${subject} · ` : ""}{questions.length} preguntas generadas con IA. Verifica con tu docente si algo no coincide con tu clase.</p>
      </div>

      {questions.map((q, i) => (
        <div key={i} className="space-y-2">
          <p className="text-slate-100 text-sm font-medium">{i + 1}. <Md>{q.statement}</Md></p>
          <div className="grid gap-2">
            {q.options.map((opt, j) => {
              const chosen = answers[i] === j;
              const isRight = j === q.correctIndex;
              let cls = "border-slate-700 hover:border-slate-500";
              if (submitted && isRight) cls = "border-emerald-500 bg-emerald-950/40";
              else if (submitted && chosen) cls = "border-red-500 bg-red-950/40";
              else if (chosen) cls = "border-blue-500 bg-blue-950/40";
              return (
                <button
                  key={j}
                  disabled={submitted}
                  onClick={() => setAnswers({ ...answers, [i]: j })}
                  className={`text-left text-sm text-slate-200 border rounded-lg px-3 py-2 transition ${cls}`}
                >
                  <Md>{opt}</Md>
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="text-xs text-slate-400"><strong>{answers[i] === q.correctIndex ? "✅ Correcto." : "❌ Revisa este punto."}</strong> <Md>{q.explanation}</Md></p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={!allAnswered} className={`btn-primary ${!allAnswered ? "opacity-50" : ""}`}>
          Ver mi resultado
        </button>
      ) : (
        <div className="border-t border-slate-700 pt-5 space-y-4">
          <p className={`text-3xl font-bold ${passed ? "text-emerald-400" : "text-orange-400"}`}>{score}%</p>
          <p className="text-sm text-slate-300">{correct} de {questions.length} correctas. {passed ? "Buen dominio de tu material." : "Todavía hay vacíos: elige tu siguiente paso."}</p>
          {/* Mismo nodo de decisión que en los cursos piloto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button onClick={onPractice} className="btn-primary py-3">🧠 Practicar con {technique}</button>
            <button
              onClick={() => navigate(`/mentors?${new URLSearchParams({ course: subject || "Material propio", topic: subject || "Material propio", score: String(score) })}`)}
              className={`${passed ? "btn-secondary" : "btn-primary bg-emerald-600 hover:bg-emerald-500"} py-3`}
            >
              🤝 Contactar a un mentor
            </button>
          </div>
          <button onClick={generate} className="text-sm text-blue-400 hover:underline">Generar otras preguntas</button>
        </div>
      )}
    </div>
  );
}
