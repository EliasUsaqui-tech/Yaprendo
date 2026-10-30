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
        // ORDENAMIENTO: Ponemos Fundamentos del Cálculo primero
        const sortedCourses = data.sort((a, b) => {
          if (a.code === "FUNCAL") return -1; // FUNCAL va primero
          if (b.code === "FUNCAL") return 1;
          return 0; // El resto se queda igual
        });
        setCourses(sortedCourses);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  // Lista de códigos de cursos que estarán bloqueados (Próximamente)
  const lockedCourses = ["CAL1", "FIS1"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">
        Selecciona tu curso
      </h1>
      <p className="text-slate-400 mb-6">
        Elige el curso filtro que estás llevando este ciclo.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => {
          const isLocked = lockedCourses.includes(course.code);

          return (
            <div
              key={course._id}
              onClick={() => !isLocked && navigate(`/courses/${course._id}`)}
              className={`card text-left relative overflow-hidden transition ${
                isLocked 
                  ? "opacity-60 cursor-not-allowed grayscale" 
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
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-950/90 border border-slate-600 text-slate-300 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm z-10">
                  🔒 Próximamente
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}