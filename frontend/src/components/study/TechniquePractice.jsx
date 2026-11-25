import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import api from "../../services/api";

// Panel de práctica que cambia según la técnica elegida.
// Hace que la técnica tenga efecto real en cómo se estudia el tema.

const Markdown = ({ children }) => (
  <div className="text-slate-300 text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{children || ""}</ReactMarkdown>
  </div>
);

const askAI = async (payload) => {
  const { data } = await api.post("/auth/ai/technique", payload);
  return data.reply;
};

// ---------- FEYNMAN: el alumno explica, la IA detecta vacíos ----------
function FeynmanPractice({ topic, content }) {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true); setError("");
    try {
      setFeedback(await askAI({ mode: "feynman", topicName: topic, topicContent: content, studentText: text }));
    } catch {
      setError("No se pudo obtener la retroalimentación. Intenta de nuevo en unos segundos.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-300">
        <strong>Paso 1:</strong> lee el resumen. <strong>Paso 2:</strong> explícalo aquí con tus palabras, como si se lo enseñaras a un compañero que no lo conoce. La IA te dirá qué explicaste bien y qué vacíos tienes.
      </p>
      <textarea
        className="input-field min-h-[140px]"
        placeholder="Escribe tu explicación del tema..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={submit} disabled={loading || text.trim().length < 40} className={`btn-primary ${loading || text.trim().length < 40 ? "opacity-50" : ""}`}>
        {loading ? "Analizando..." : "Revisar mi explicación"}
      </button>
      {text.trim().length > 0 && text.trim().length < 40 && <p className="text-xs text-slate-500">Escribe al menos un par de oraciones.</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}
      {feedback && <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4"><Markdown>{feedback}</Markdown></div>}
    </div>
  );
}

// ---------- ACTIVE RECALL: recordar antes de releer ----------
function RecallPractice({ topic, content, revealed, onReveal }) {
  const [recalled, setRecalled] = useState("");
  const [rating, setRating] = useState(null);
  const [questions, setQuestions] = useState("");
  const [loading, setLoading] = useState(false);

  const genQuestions = async () => {
    setLoading(true);
    try { setQuestions(await askAI({ mode: "recall", topicName: topic, topicContent: content })); }
    catch { setQuestions("No se pudieron generar preguntas ahora. Intenta de nuevo."); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-3">
      {!revealed ? (
        <>
          <p className="text-sm text-slate-300">
            El resumen está <strong>oculto a propósito</strong>. Antes de leerlo, escribe todo lo que recuerdes de <strong>{topic}</strong>: definiciones, fórmulas, ejemplos.
          </p>
          <textarea className="input-field min-h-[120px]" placeholder="Lo que recuerdo es..." value={recalled} onChange={(e) => setRecalled(e.target.value)} />
          <button onClick={onReveal} className="btn-primary">Revelar el resumen y comparar</button>
        </>
      ) : (
        <>
          {recalled && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Lo que recordaste:</p>
              <p className="text-sm text-slate-200 whitespace-pre-wrap">{recalled}</p>
            </div>
          )}
          <p className="text-sm text-slate-300">Compara con el resumen. ¿Cuánto recordaste?</p>
          <div className="flex flex-wrap gap-2">
            {[["bien", "✅ Casi todo"], ["parcial", "🟡 Una parte"], ["poco", "🔴 Muy poco"]].map(([k, label]) => (
              <button key={k} onClick={() => setRating(k)} className={`btn-secondary text-xs ${rating === k ? "border-emerald-500" : ""}`}>{label}</button>
            ))}
          </div>
          {rating && (
            <p className="text-xs text-slate-400">
              {rating === "bien" ? "¡Bien! Pasa a la autoevaluación para confirmarlo." : "Genera preguntas de recuerdo y vuelve a intentarlo sin mirar el resumen."}
            </p>
          )}
          <button onClick={genQuestions} disabled={loading} className="btn-secondary text-sm">
            {loading ? "Generando..." : "⚡ Generar 5 preguntas de recuerdo"}
          </button>
          {questions && <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4"><Markdown>{questions}</Markdown></div>}
        </>
      )}
    </div>
  );
}

// ---------- POMODORO: bloques de estudio con descanso ----------
function PomodoroPractice() {
  const STUDY = 25 * 60, BREAK = 5 * 60;
  const [phase, setPhase] = useState("study");
  const [left, setLeft] = useState(STUDY);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  useEffect(() => {
    if (left > 0) return;
    if (phase === "study") { setCycles((c) => c + 1); setPhase("break"); setLeft(BREAK); }
    else { setPhase("study"); setLeft(STUDY); }
  }, [left, phase, STUDY, BREAK]);

  const mm = String(Math.floor(Math.max(left, 0) / 60)).padStart(2, "0");
  const ss = String(Math.max(left, 0) % 60).padStart(2, "0");

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className={`text-5xl font-mono font-bold ${phase === "study" ? "text-red-300" : "text-emerald-300"}`}>{mm}:{ss}</div>
      <div className="space-y-2 text-sm text-slate-300">
        <p>{phase === "study" ? "📚 Bloque de estudio: lee el resumen y resuelve los ejemplos sin distraerte." : "☕ Descanso: aléjate de la pantalla. Al volver, intenta el quiz."}</p>
        <p className="text-xs text-slate-400">Pomodoros completados en este tema: <strong>{cycles}</strong></p>
        <div className="flex gap-2">
          <button onClick={() => setRunning((r) => !r)} className="btn-primary text-xs">{running ? "Pausar" : "Iniciar"}</button>
          <button onClick={() => { setRunning(false); setPhase("study"); setLeft(STUDY); }} className="btn-secondary text-xs">Reiniciar</button>
        </div>
      </div>
    </div>
  );
}

// ---------- RESOLUCIÓN DE PROBLEMAS: ejercicio guiado y corrección ----------
function ProblemPractice({ topic, content }) {
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const gen = async () => {
    setLoading(true); setFeedback(""); setSolution("");
    try { setProblem(await askAI({ mode: "problem", topicName: topic, topicContent: content })); }
    catch { setProblem("No se pudo generar el ejercicio ahora. Intenta de nuevo."); }
    finally { setLoading(false); }
  };
  const check = async () => {
    setLoading(true);
    try { setFeedback(await askAI({ mode: "problem-check", topicName: topic, topicContent: content, problemText: problem, studentText: solution })); }
    catch { setFeedback("No se pudo corregir ahora. Intenta de nuevo."); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-300">Resuelve un ejercicio tipo examen siguiendo 4 pasos: <strong>Datos → Plan → Solución → Verificación</strong>.</p>
      <button onClick={gen} disabled={loading} className="btn-primary text-sm">{loading && !problem ? "Generando..." : problem ? "Otro ejercicio" : "🧩 Generar ejercicio"}</button>
      {problem && (
        <>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4"><Markdown>{problem}</Markdown></div>
          <textarea
            className="input-field min-h-[140px]"
            placeholder={"Datos: ...\nPlan: ...\nSolución: ...\nVerificación: ..."}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
          />
          <button onClick={check} disabled={loading || solution.trim().length < 10} className={`btn-secondary text-sm ${solution.trim().length < 10 ? "opacity-50" : ""}`}>
            {loading ? "Corrigiendo..." : "Corregir mi solución"}
          </button>
          {feedback && <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4"><Markdown>{feedback}</Markdown></div>}
        </>
      )}
    </div>
  );
}

export default function TechniquePractice({ type, topic, content, revealed, onReveal, techColor }) {
  const titles = {
    feynman: "🧠 Práctica Feynman: explícalo con tus palabras",
    "active-recall": "⚡ Práctica de Active Recall: recuerda antes de releer",
    pomodoro: "⏱️ Sesión Pomodoro",
    "problem-solving": "🧩 Resolución de problemas guiada",
  };
  return (
    <div className={`card bg-slate-900 ${techColor?.border || "border-slate-700"}`}>
      <h2 className={`text-lg font-bold mb-3 ${techColor?.text || "text-slate-100"}`}>{titles[type] || titles["active-recall"]}</h2>
      {type === "feynman" && <FeynmanPractice topic={topic} content={content} />}
      {type === "pomodoro" && <PomodoroPractice />}
      {type === "problem-solving" && <ProblemPractice topic={topic} content={content} />}
      {(type === "active-recall" || !titles[type]) && <RecallPractice topic={topic} content={content} revealed={revealed} onReveal={onReveal} />}
    </div>
  );
}
