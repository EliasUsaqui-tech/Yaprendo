import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseService } from "../services/courseService";
import { quizService } from "../services/quizService";
import Loader from "../components/common/Loader";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el Modo Enfoque
  const [activeTechnique, setActiveTechnique] = useState(null);

  useEffect(() => {
    // Revisamos si venimos de aplicar una técnica
    const savedTechnique = localStorage.getItem("active_technique");
    if (savedTechnique) {
      setActiveTechnique(JSON.parse(savedTechnique));
    }

    Promise.all([
      courseService.getById(id),
      courseService.getTopics(id),
      quizService.getAll({ course: id }),
    ])
      .then(([c, t, q]) => {
        setCourse(c);
        setTopics(t);
        setQuizzes(q);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const clearFocusMode = () => {
    localStorage.removeItem("active_technique");
    setActiveTechnique(null);
  };

  if (loading) return <Loader />;
  if (!course)
    return <p className="text-center py-12 text-slate-300">Curso no encontrado</p>;

  // ==========================================
  // VALIDACIÓN DE SEGURIDAD (CURSOS BLOQUEADOS)
  // ==========================================
  const lockedCourses = ["CAL1", "FIS1"];
  const courseCode = course.code ? course.code.toUpperCase() : "";

  if (lockedCourses.includes(courseCode)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl mb-4 block">🔒</span>
        <h1 className="text-3xl font-bold text-slate-100 mb-4">Contenido Próximamente</h1>
        <p className="text-slate-400 mb-8">
          El curso <strong>{course.name}</strong> aún no está disponible para autoevaluación. 
          Estamos trabajando para traerte el mejor contenido.
        </p>
        <Link to="/courses" className="btn-primary px-6 py-2 inline-block">
          Volver a cursos disponibles
        </Link>
      </div>
    );
  }

  // Si pasa la validación, se muestra el contenido normal
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/courses" className="text-sm text-blue-400 hover:underline">
        ← Volver a cursos
      </Link>

      <h1 className="text-3xl font-bold text-slate-100 mt-3 mb-1">
        {course.name}
      </h1>
      <p className="text-slate-400 mb-6">{course.description}</p>

      {activeTechnique && (
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-500 rounded-xl p-4 mb-8 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🎯</span>
            <div>
              <h3 className="text-lg font-bold text-white">Modo Enfoque Activado</h3>
              <p className="text-sm text-purple-200">
                Estás aplicando la <strong>{activeTechnique.title}</strong> en este curso.
              </p>
            </div>
          </div>
          <button 
            onClick={clearFocusMode}
            className="text-xs bg-black/30 hover:bg-black/50 text-white px-3 py-2 rounded-lg transition"
          >
            Salir del Enfoque
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
            📖 Temas del curso
          </h2>
          <ul className="space-y-2">
            {topics.map((t) => (
              <li key={t._id}>
                <Link
                  to={`/topics/${t._id}`}
                  className="block border border-slate-700 rounded-lg p-4 text-sm hover:bg-slate-800 hover:border-slate-500 transition group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-slate-200 group-hover:text-white transition">
                        {t.name}
                      </span>
                      {t.description && (
                        <p className="text-slate-400 text-xs mt-1 line-clamp-1">
                          {t.description}
                        </p>
                      )}
                    </div>
                    <span className="text-slate-500 group-hover:text-slate-300">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="card h-fit">
          <h2 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
            📝 Autoevaluaciones disponibles
          </h2>
          {quizzes.length === 0 ? (
            <p className="text-sm text-slate-400">
              Aún no hay quizzes disponibles para este curso.
            </p>
          ) : (
            <ul className="space-y-3">
              {quizzes.map((q) => (
                <li
                  key={q._id}
                  className="border border-slate-700 rounded-lg p-3 flex justify-between items-center bg-slate-800/50"
                >
                  <div>
                    <p className="font-medium text-sm text-slate-200">
                      {q.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {q.estimatedMinutes} min · {q.difficulty}
                    </p>
                  </div>
                  <Link to={`/quiz/${q._id}`} className="btn-primary text-xs py-1.5 px-3">
                    Empezar
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}