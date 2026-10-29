import { useEffect, useState } from "react";
import { techniqueService } from "../services/techniqueService";
import { courseService } from "../services/courseService";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";

export default function Techniques() {
  const [techniques, setTechniques] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  useEffect(() => {
    Promise.all([techniqueService.getAll(), courseService.getAll()])
      .then(([techData, courseData]) => {
        setTechniques(techData);
        setCourses(courseData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleOpenModal = (technique) => {
    setSelectedTechnique(technique);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTechnique(null);
  };

  const handleApply = (courseId, courseName) => {
    // Guardamos el curso y la técnica en el localStorage
    localStorage.setItem("active_course", JSON.stringify({ id: courseId, name: courseName }));
    localStorage.setItem("active_technique", JSON.stringify(selectedTechnique));
    
    // Redirigimos al detalle del curso
    navigate(`/courses/${courseId}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">
        Técnicas de estudio activo
      </h1>
      <p className="text-slate-400 mb-6">
        Métodos curados por curso y tema. Prioriza método, no volumen.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techniques.map((t) => {
          if (t.type === "pomodoro") {
            return <PomodoroCard key={t._id} technique={t} onApply={() => handleOpenModal(t)} />;
          }

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
                  <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1 mb-6">
                    {t.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                )}
              </div>
              
              <div>
                <button 
                  onClick={() => handleOpenModal(t)}
                  className="btn-primary w-full mb-4 text-sm"
                >
                  Aplicar esta técnica
                </button>
                <div className="flex justify-between text-xs text-slate-500 pt-3 border-t border-slate-700">
                  <span>{t.course?.name || "General"}</span>
                  <span>{t.estimatedMinutes} min</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL PARA ELEGIR EL CURSO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-slate-100 mb-2">
              ¿A qué curso aplicarás esta técnica?
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Vas a aplicar <strong className="text-blue-400">{selectedTechnique?.title}</strong>. Elige el curso para comenzar.
            </p>

            <div className="space-y-3 mb-6">
              {courses.map((course) => (
                <button
                  key={course._id}
                  onClick={() => handleApply(course._id, course.name)}
                  className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-3 transition flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-slate-200">{course.name}</p>
                    <p className="text-xs text-slate-400">{course.code}</p>
                  </div>
                  <span className="text-slate-500">→</span>
                </button>
              ))}
            </div>

            <button 
              onClick={handleCloseModal}
              className="w-full py-2 text-sm text-slate-400 hover:text-white transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENTE DEL CRONÓMETRO POMODORO
// ==========================================
function PomodoroCard({ technique, onApply }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus");

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
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

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="card flex flex-col justify-between border-emerald-800 bg-slate-900 shadow-xl relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 ${mode === 'focus' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
      
      <div>
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-semibold text-slate-100 text-lg">Técnica Pomodoro</h2>
          <span className={`text-xs border px-2 py-0.5 rounded ${mode === "focus" ? "bg-red-950 text-red-300 border-red-800" : "bg-emerald-950 text-emerald-300 border-emerald-800"}`}>
            {mode === "focus" ? "Enfoque" : "Descanso"}
          </span>
        </div>
        <p className="text-sm text-slate-300 mb-4">{technique.description}</p>
        
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
      </div>

      <div>
        <button 
          onClick={onApply}
          className="bg-emerald-600 hover:bg-emerald-500 text-white w-full mb-4 py-2 rounded-lg font-medium transition text-sm"
        >
          Aplicar Pomodoro
        </button>
        <div className="flex justify-between text-xs text-slate-500 pt-3 border-t border-slate-700">
          <span>{technique.course?.name || "General"}</span>
          <span>{technique.estimatedMinutes} min</span>
        </div>
      </div>
    </div>
  );
}