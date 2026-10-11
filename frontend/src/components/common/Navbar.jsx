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

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="font-bold text-lg text-blue-400">
          UTEC · Acompañamiento
        </Link>
        {user && (
          <div className="flex items-center gap-1">
            <Link to="/dashboard" className={linkClass("/dashboard")}>Inicio</Link>
            <Link to="/courses" className={linkClass("/courses")}>Cursos</Link>
            <Link to="/techniques" className={linkClass("/techniques")}>Técnicas</Link>
            <Link to="/mentors" className={linkClass("/mentors")}>Mentores</Link>
            <Link to="/progress" className={linkClass("/progress")}>Progreso</Link>
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