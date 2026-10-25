import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Recommendation() {
  const [technique, setTechnique] = useState("");

  useEffect(() => {
    const rec = localStorage.getItem("recommended_technique");
    setTechnique(rec || "recall");
  }, []);

  const details = {
    feynman: {
      title: "Técnica Feynman 🧠",
      desc: "Eres bueno para las ideas abstractas. Para dominar los temas, explica conceptos complejos con palabras simples, como si le enseñaras a un niño.",
      color: "border-blue-500",
    },
    recall: {
      title: "Active Recall (Recuerdo Activo) ⚡",
      desc: "Tu cerebro aprende mejor haciéndose preguntas. Deja de releer y empieza a usar tarjetas o a hacerte exámenes cortos por tu cuenta.",
      color: "border-emerald-500",
    },
    pomodoro: {
      title: "Repetición Espaciada y Pomodoro ⏱️",
      desc: "Necesitas estructurar tus tiempos. Estudia en bloques de 25 minutos y asegúrate de repasar lo aprendido a los 3 y 7 días.",
      color: "border-orange-500",
    },
  };

  const rec = details[technique] || details.recall;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className={`card w-full max-w-lg bg-slate-900 border-l-4 ${rec.color} border-slate-800`}>
        <h2 className="text-sm font-bold text-slate-400 mb-1">TU TÉCNICA RECOMENDADA</h2>
        <h1 className="text-3xl font-bold text-slate-100 mb-4">{rec.title}</h1>
        <p className="text-slate-300 mb-8">{rec.desc}</p>
        
        <div className="flex gap-4">
          <Link to="/dashboard" className="btn-primary w-full text-center">
            Ir a mi Dashboard
          </Link>
          <Link to="/techniques" className="btn-secondary w-full text-center">
            Ver biblioteca
          </Link>
        </div>
      </div>
    </div>
  );
}