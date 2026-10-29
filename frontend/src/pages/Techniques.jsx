import { useEffect, useState } from "react";
import { techniqueService } from "../services/techniqueService";
import Loader from "../components/common/Loader";

export default function Techniques() {
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    techniqueService
      .getAll()
      .then(setTechniques)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">
        Técnicas de estudio activo
      </h1>
      <p className="text-slate-400 mb-6">
        Métodos curados por curso y tema. Prioriza método, no volumen.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {techniques.map((t) => {
          // Si es Pomodoro, renderizamos la tarjeta especial con el reloj
          if (t.type === "pomodoro") {
            return <PomodoroCard key={t._id} technique={t} />;
          }

          // Tarjeta normal para las demás técnicas
          return (
            <div key={t._id} className="card flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold text-slate-100 text-lg">{t.title}</h2>
                  <span className="text-xs bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                    {t.type}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-3">{t.description}</p>
                {t.steps?.length > 0 && (
                  <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1 mb-4">
                    {t.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                )}
              </div>
              <div className="flex justify-between text-xs text-slate-500 pt-3 border-t border-slate-700">
                <span>{t.course?.name || "General"}</span>
                <span>{t.estimatedMinutes} min</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE DEL CRONÓMETRO POMODORO
// ==========================================
function PomodoroCard({ technique }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos en segundos
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus"); // "focus" o "break"

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Cuando llega a cero, cambia de modo y avisa
      if (mode === "focus") {
        alert("¡Tiempo de enfoque terminado! Tómate 5 minutos de descanso.");
        setMode("break");
        setTimeLeft(5 * 60);
        setIsActive(false);
      } else {
        alert("¡Descanso terminado! Vuelve al enfoque.");
        setMode("focus");
        setTimeLeft(25 * 60);
        setIsActive(false);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  // Formatear tiempo a MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="card flex flex-col justify-between border-emerald-800 bg-slate-900 shadow-xl relative overflow-hidden">
      {/* Indicador visual del modo */}
      <div className={`absolute top-0 left-0 w-full h-1 ${mode === 'focus' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
      
      <div>
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-semibold text-slate-100 text-lg">Técnica Pomodoro</h2>
          <span className={`text-xs border px-2 py-0.5 rounded ${mode === "focus" ? "bg-red-950 text-red-300 border-red-800" : "bg-emerald-950 text-emerald-300 border-emerald-800"}`}>
            {mode === "focus" ? "Enfoque" : "Descanso"}
          </span>
        </div>
        <p className="text-sm text-slate-300 mb-4">{technique.description}</p>
        
        {/* Cronómetro Visual */}
        <div className="flex flex-col items-center justify-center py-6 mb-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className={`text-6xl font-mono font-bold tracking-tight ${mode === 'focus' ? 'text-red-400' : 'text-emerald-400'}`}>
            {formattedTime}
          </span>
          <div className="flex gap-4 mt-6">
            <button 
              onClick={toggleTimer}
              className={`px-6 py-2 rounded-lg font-medium transition shadow-md ${
                isActive ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-600 text-white hover:bg-red-500"
              }`}
            >
              {isActive ? "Pausar" : "Iniciar"}
            </button>
            <button 
              onClick={resetTimer}
              className="px-4 py-2 rounded-lg font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
            >
              Reiniciar
            </button>
          </div>
        </div>

        {technique.steps?.length > 0 && (
          <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1 mb-4">
            {technique.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        )}
      </div>
      <div className="flex justify-between text-xs text-slate-500 pt-3 border-t border-slate-700">
        <span>{technique.course?.name || "General"}</span>
        <span>{technique.estimatedMinutes} min</span>
      </div>
    </div>
  );
}