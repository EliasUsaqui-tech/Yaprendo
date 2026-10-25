import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AVATARS } from "../../utils/avatars"; // Importar

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

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="font-bold text-lg text-blue-400">
          UTEC · Acompañamiento
        </Link>
        
        {user && (
          <div className="flex items-center gap-1">
            <Link to="/dashboard" className={linkClass("/dashboard")}>Inicio</Link>

            {/* ====== VISTAS EXCLUSIVAS DEL ESTUDIANTE ====== */}
            {user.role === "student" && (
              <>
                <Link to="/courses" className={linkClass("/courses")}>Cursos</Link>
                <Link to="/progress" className={linkClass("/progress")}>Progreso</Link>
              </>
            )}

            {/* ====== VISTAS EXCLUSIVAS DEL MENTOR ====== */}
            {user.role === "mentor" && (
              <Link to="/mentor-panel" className={linkClass("/mentor-panel")}>Panel Mentor</Link>
            )}
            
            {user.avatar && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ml-2 ${AVATARS.find(a => a.id === user.avatar)?.bg || "bg-slate-700"}`}>
                {AVATARS.find(a => a.id === user.avatar)?.emoji || "👤"}
              </div>
            )}

            {/* ====== VISTAS COMPARTIDAS (Ambos roles) ====== */}
            <Link to="/techniques" className={linkClass("/techniques")}>Técnicas</Link>
            <Link to="/mentors" className={linkClass("/mentors")}>Directorio</Link>

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