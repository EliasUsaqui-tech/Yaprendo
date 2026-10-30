import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

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

  // Redirige al panel correcto dependiendo del rol
  const homePath = user?.role === "mentor" ? "/mentor-panel" : "/dashboard";

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to={homePath} className="font-bold text-lg text-blue-400 hover:text-blue-300 transition">
          Yaprendo
        </Link>
        
        {user && (
          <div className="flex items-center gap-1">
            
            {/* INICIO (Solo estudiantes) */}
            {user.role === "student" && (
              <Link to="/dashboard" className={linkClass("/dashboard")}>Inicio</Link>
            )}

            {/* ESTUDIANTE */}
            {user.role === "student" && (
              <>
                <Link to="/courses" className={linkClass("/courses")}>Cursos</Link>
                <Link to="/progress" className={linkClass("/progress")}>Progreso</Link>
              </>
            )}

            {/* MENTOR */}
            {user.role === "mentor" && (
              <Link to="/mentor-panel" className={linkClass("/mentor-panel")}>Panel Mentor</Link>
            )}

            {/* COMPARTIDOS */}
            <Link to="/techniques" className={linkClass("/techniques")}>Técnicas</Link>
            <Link to="/mentors" className={linkClass("/mentors")}>Directorio</Link>

            {/* BOTÓN EDITAR PERFIL (Reemplaza al avatar) */}
            <Link 
              to="/profile" 
              className="ml-3 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium transition border border-slate-700"
            >
              Editar perfil
            </Link>

            {/* BOTÓN SALIR */}
            <button
              onClick={handleLogout}
              className="ml-2 text-sm text-slate-400 hover:text-red-400 px-2 py-1.5 transition"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}