import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAvatarUrl } from "../utils/avatars"; // <-- NUEVA IMPORTACIÓN

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "mentor") {
    return <Navigate to="/mentor-panel" replace />;
  }

  const initialAvatar = user?.avatar || "bottts|utec";
  const [avatarStyle, avatarSeed, bgColor, accessories] = initialAvatar.split("|");
  const avatarUrl = getAvatarUrl(avatarStyle, avatarSeed, bgColor || "", accessories || "");

  const cards = [
    {
      to: "/courses",
      title: "Cursos",
      desc: "Elige tu curso filtro y accede a sus temas.",
      color: "border-l-4 border-blue-500",
    },
    {
      to: "/techniques",
      title: "Técnicas de estudio",
      desc: "Métodos activos curados por curso y tema.",
      color: "border-l-4 border-emerald-500",
    },
    {
      to: "/mentors",
      title: "Mentores",
      desc: "Conecta con estudiantes de ciclos superiores.",
      color: "border-l-4 border-purple-500",
    },
    {
      to: "/progress",
      title: "Mi progreso",
      desc: "Visualiza tu avance real por tema.",
      color: "border-l-4 border-orange-500",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* AVATAR Y SALUDO */}
      <div className="flex items-center gap-5 mb-8">
        {/* Avatar generado */}
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-blue-500 bg-slate-800 shrink-0">
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Hola, {user?.name?.split(" ")[0] || "estudiante"} 👋
          </h1>
          <p className="text-slate-400">
            Tu espacio para estudiar con método y comprobar tu comprensión real.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className={`card hover:bg-slate-700 hover:shadow-md transition ${c.color}`}
          >
            <h2 className="text-lg font-semibold text-slate-100 mb-1">
              {c.title}
            </h2>
            <p className="text-sm text-slate-400">{c.desc}</p>
          </Link>
        ))}
      </div>

      {/* TARJETA DEL TEST */}
      <Link
        to="/test"
        className="card mt-6 bg-gradient-to-r from-blue-950 to-purple-950 border border-purple-800 hover:shadow-lg hover:border-purple-600 transition block"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-purple-200 mb-1 flex items-center gap-2">
              🧠 ¿No sabes cómo estudiar?
            </h2>
            <p className="text-sm text-slate-300">
              Haz nuestro test rápido de 6 preguntas y descubre qué técnica activa se adapta mejor a ti.
            </p>
          </div>
          <div className="text-4xl hidden md:block">🎯</div>
        </div>
      </Link>

      {/* RECOMENDACIÓN GENERAL */}
      <div className="card mt-8 bg-blue-950 border-blue-800">
        <h3 className="font-semibold text-blue-300 mb-1">
          💡 Método recomendado
        </h3>
        <p className="text-sm text-slate-300">
          Antes de cada examen, realiza una autoevaluación corta. Si no alcanzas
          el 70%, repasa el tema y vuelve a intentarlo.
        </p>
      </div>
    </div>
  );
}