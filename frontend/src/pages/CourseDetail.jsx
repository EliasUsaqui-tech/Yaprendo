import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { courseService } from "../services/courseService";
import { quizService } from "../services/quizService";
import Loader from "../components/common/Loader";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) return <Loader />;
  if (!course)
    return <p className="text-center py-12 text-slate-300">Curso no encontrado</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/courses" className="text-sm text-blue-400 hover:underline">
        ← Volver a cursos
      </Link>

      <h1 className="text-3xl font-bold text-slate-100 mt-3 mb-1">
        {course.name}
      </h1>
      <p className="text-slate-400 mb-6">{course.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold text-slate-100 mb-3">
            📖 Temas del curso
          </h2>
          <ul className="space-y-2">
            {topics.map((t) => (
              <li
                key={t._id}
                className="border border-slate-700 rounded-lg p-3 text-sm"
              >
                <span className="font-medium text-slate-200">{t.name}</span>
                {t.description && (
                  <p className="text-slate-400 text-xs mt-1">{t.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-100 mb-3">
            📝 Autoevaluaciones
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
                  className="border border-slate-700 rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm text-slate-100">
                      {q.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {q.estimatedMinutes} min · {q.difficulty}
                    </p>
                  </div>
                  <Link to={`/quiz/${q._id}`} className="btn-primary text-xs">
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