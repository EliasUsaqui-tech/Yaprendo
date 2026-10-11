import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../services/courseService";
import Loader from "../components/common/Loader";

export default function CourseSelection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    courseService
      .getAll()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">
        Selecciona tu curso
      </h1>
      <p className="text-slate-400 mb-6">
        Elige el curso filtro que estás llevando este ciclo.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <button
            key={course._id}
            onClick={() => navigate(`/courses/${course._id}`)}
            className="card text-left hover:bg-slate-750 hover:shadow-md transition"
            style={{ borderTop: `4px solid ${course.color || "#3b82f6"}` }}
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-slate-100">{course.name}</h2>
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                {course.code}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{course.description}</p>
            <p className="text-xs text-slate-500">
              {course.topics?.length || 0} temas disponibles
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}