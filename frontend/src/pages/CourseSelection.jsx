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
      .then((data) => {
        // Forzamos el orden aquí también por si acaso
        const sorted = [...data].sort((a, b) => {
          if (a.code === "FUNCAL") return -1;
          if (b.code === "FUNCAL") return 1;
          return 0;
        });
        setCourses(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  // Cursos bloqueados
  const lockedCourses = ["CAL1", "FIS1"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">
        Selecciona tu curso
      </h1>
      <p className="text-slate-400 mb-6">
        Elige el curso filtro que estás llevando este ciclo.
      </p>

      {/* Usamos un flex en lugar de grid para controlar el orden mejor */}
      <div className="flex flex-wrap gap-4">
        {courses.map((course) => {
          const isLocked = lockedCourses.includes(course.code);

          return (
            <div
              key={course._id}
              onClick={() => !isLocked && navigate(`/courses/${course._id}`)}
              className={`card text-left relative overflow-hidden transition w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] ${
                isLocked 
                  ? "opacity-50 cursor-not-allowed grayscale" 
                  : "hover:shadow-md hover:bg-slate-800/80 cursor-pointer"
              }`}
              style={{ borderTop: `4px solid ${course.color || "#1e40af"}` }}
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

              {/* ETIQUETA DE PRÓXIMAMENTE */}
              {isLocked && (
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center z-10">
                  <span className="bg-slate-900 border border-slate-500 text-slate-200 font-bold text-sm px-4 py-2 rounded-full shadow-xl">
                    🔒 Próximamente
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}