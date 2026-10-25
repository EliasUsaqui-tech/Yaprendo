import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AVATARS } from "../../utils/avatars";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      location.pathname === path
        ? "bg-utec-primary text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`;

  // Buscamos el avatar del usuario, si no tiene uno, usamos el primero por defecto
  const currentAvatar = AVATARS.find((a) => a.id === user?.avatar) || AVATARS[0];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="font-bold text-lg text-blue-400">
          UTEC · Acompañamiento
        </Link>
        
        {user && (
          <div className="flex items-center gap-1">
            <Link to="/dashboard" className={linkClass("/dashboard")}>Inicio</Link>

            {/* VISTAS EXCLUSIVAS DEL ESTUDIANTE */}
            {user.role === "student" && (
              <>
                <Link to="/courses" className={linkClass("/courses")}>Cursos</Link>
                <Link to="/progress" className={linkClass("/progress")}>Progreso</Link>
              </>
            )}

            {/* VISTAS EXCLUSIVAS DEL MENTOR */}
            {user.role === "mentor" && (
              <Link to="/mentor-panel" className={linkClass("/mentor-panel")}>Panel Mentor</Link>
            )}

            {/* VISTAS COMPARTIDAS */}
            <Link to="/techniques" className={linkClass("/techniques")}>Técnicas</Link>
            <Link to="/mentors" className={linkClass("/mentors")}>Directorio</Link>

            {/* BOTÓN DE PERFIL (Avatar) */}
            <Link 
              to="/profile" 
              title="Ir a mi perfil"
              className="ml-3 flex items-center gap-2 hover:opacity-80 transition"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-md ${currentAvatar.bg}`}>
                {currentAvatar.emoji}
              </div>
            </Link>

            {/* BOTÓN DE SALIR */}
            <button
              onClick={handleLogout}
              className="ml-3 text-sm text-slate-400 hover:text-red-400"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}