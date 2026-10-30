import { useEffect, useState } from "react";
import { progressService } from "../services/progressService";
import Loader from "../components/common/Loader";
import { Link } from "react-router-dom";

export default function Progress() {
  const [coursesProgress, setCoursesProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService.getMine()
      .then((data) => {
        // Ajustamos para leer la nueva estructura del backend
        setCoursesProgress(data.coursesProgress || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">Mi progreso</h1>
      <p className="text-slate-400 mb-8">
        Visualiza tu avance real por curso y tema. Se considera dominado si obtienes más del 70% en el quiz.
      </p>

      {coursesProgress.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-slate-300 mb-2 text-lg font-medium">Aún no has realizado ninguna autoevaluación.</p>
          <p className="text-slate-500 text-sm mb-6">Realiza un quiz para empezar a medir tu progreso real.</p>
          <Link to="/courses" className="btn-primary inline-block">
            Ir a cursos
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {coursesProgress.map((course) => (
            <div key={course.courseId} className="card">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">{course.courseName}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Has dominado {course.dominados} de {course.totalQuizzes} temas.
                  </p>
                </div>
                <span className={`text-2xl font-bold ${
                  course.percentage === 100 ? 'text-emerald-400' : 'text-blue-400'
                }`}>
                  {course.percentage}%
                </span>
              </div>

              {/* BARRA DE PROGRESO */}
              <div className="w-full bg-slate-800 rounded-full h-4 mb-6 overflow-hidden">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 ${
                    course.percentage === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${course.percentage}%` }}
                >
                  {course.percentage > 10 && (
                    <span className="text-[10px] font-bold text-white">
                      {course.percentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* DETALLE POR TEMA */}
              <div className="space-y-2">
                {course.topics.map((topic, index) => (
                  <div key={index} className="flex justify-between items-center bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                    <span className="text-sm text-slate-300 truncate">{topic.name}</span>
                    <div className="flex items-center gap-3">
                      {topic.status === "dominado" && (
                        <span className="text-xs bg-emerald-950 text-emerald-300 px-2 py-1 rounded border border-emerald-800">
                          ✅ Dominado ({topic.bestScore}%)
                        </span>
                      )}
                      {topic.status === "en-progreso" && (
                        <span className="text-xs bg-orange-950 text-orange-300 px-2 py-1 rounded border border-orange-800">
                          🔄 En Progreso ({topic.bestScore}%)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}