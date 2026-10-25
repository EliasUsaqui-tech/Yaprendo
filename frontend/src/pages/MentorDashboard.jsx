import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { getAvatarUrl } from "../utils/avatars";

export default function MentorDashboard() {
  const { user } = useAuth();

  // Separamos las 4 partes del avatar: estilo | semilla | color | accesorios
  const avatarParts = (user?.avatar || "bottts|utec||").split("|");
  const style = avatarParts[0] || "bottts";
  const seed = avatarParts[1] || user?.name || "utec";
  const bgColor = avatarParts[2] || "";
  const accessories = avatarParts[3] || "";

  // Generamos la URL del avatar
  const avatarUrl = getAvatarUrl(style, seed, bgColor, accessories);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header del Mentor */}
      <div className="flex items-center gap-4 mb-8">
        
        {/* AVATAR DEL MENTOR */}
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-emerald-500 bg-slate-800 shrink-0">
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Panel del Mentor
          </h1>
          <p className="text-emerald-400">
            Bienvenido, {user?.name?.split(" ")[0]}. Tu experiencia es clave para los nuevos ingresos.
          </p>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card border-l-4 border-emerald-500 bg-slate-800/50">
          <p className="text-slate-400 text-sm">Solicitudes pendientes</p>
          <p className="text-4xl font-bold text-slate-100 mt-2">0</p>
        </div>
        <div className="card border-l-4 border-blue-500 bg-slate-800/50">
          <p className="text-slate-400 text-sm">Estudiantes ayudados</p>
          <p className="text-4xl font-bold text-slate-100 mt-2">0</p>
        </div>
        <div className="card border-l-4 border-purple-500 bg-slate-800/50">
          <p className="text-slate-400 text-sm">Cursos que dominas</p>
          <p className="text-4xl font-bold text-slate-100 mt-2">
            {user?.expertise?.length || 0}
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sección de Solicitudes */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-100">
              📩 Solicitudes de asesoría
            </h2>
            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
              Bandeja de entrada
            </span>
          </div>
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">
              No tienes solicitudes nuevas por ahora.
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Cuando un estudiante te contacte, aparecerá aquí.
            </p>
          </div>
        </div>

        {/* Acceso rápido a Técnicas */}
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            🧠 Recomendaciones para tus alumnos
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Como mentor, puedes sugerir técnicas de estudio activo a los estudiantes que asesores.
          </p>
          <Link to="/techniques" className="btn-secondary w-full block text-center text-sm">
            Ver biblioteca de técnicas
          </Link>
        </div>
      </div>
    </div>
  );
}