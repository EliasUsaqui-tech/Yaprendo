import { useEffect, useState } from "react";
import { progressService } from "../services/progressService";
import { courseService } from "../services/courseService";
import Loader from "../components/common/Loader";

export default function Progress() {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([courseService.getAll(), progressService.getMine()])
      .then(([c, p]) => {
        setCourses(c);
        setProgress(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const statsFor = (courseId) => {
    const items = progress.filter((p) => p.course?._id === courseId);
    const dominados = items.filter((p) => p.status === "dominado").length;
    const enProgreso = items.filter((p) => p.status === "en-progreso").length;
    return { total: items.length, dominados, enProgreso };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">Mi progreso</h1>
      <p className="text-slate-400 mb-6">
        Visualiza tu avance real por curso y tema.
      </p>

      {progress.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-400 mb-4">
            Aún no has realizado ninguna autoevaluación.
          </p>
          <a href="/courses" className="btn-primary inline-block">
            Ir a cursos
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => {
            const { total, dominados, enProgreso } = statsFor(course._id);
            if (total === 0) return null;
            const percentage = Math.round((dominados / total) * 100);

            return (
              <div key={course._id} className="card">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-slate-100">
                    {course.name}
                  </h2>
                  <span className="text-sm text-slate-300">
                    {percentage}% dominado
                  </span>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex gap-4 text-xs text-slate-400">
                  <span>✅ Dominados: {dominados}</span>
                  <span>🔄 En progreso: {enProgreso}</span>
                  <span>📚 Total: {total}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}