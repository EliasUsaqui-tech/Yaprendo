import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AVATAR_STYLES, getAvatarUrl } from "../utils/avatars"; // Importamos las nuevas funciones

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cycle: "1",
    role: "student",
    bio: "",
    avatar: `bottts|default`, // Por defecto: estilo bottts
  });
  
  const [mentorCourses, setMentorCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCourseToggle = (course) => {
    if (mentorCourses.includes(course)) {
      setMentorCourses(mentorCourses.filter((c) => c !== course));
    } else {
      setMentorCourses([...mentorCourses, course]);
    }
  };

  // Manejar la selección de estilo de avatar
  const handleAvatarSelect = (styleId) => {
    // Usamos el nombre del usuario como semilla, si está vacío usamos "utec"
    const seed = form.name.trim() || "utec"; 
    setForm({ ...form, avatar: `${styleId}|${seed}` });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validación en el frontend: Solo correos @utec.edu.pe
    if (!form.email.toLowerCase().endsWith("@utec.edu.pe")) {
      return setError("Solo se permiten correos institucionales (@utec.edu.pe)");
    }

    setLoading(true);
    
    const payload = { ...form };
    if (form.role === "mentor") {
      payload.expertise = mentorCourses;
    }

    try {
      await register(payload);
      navigate("/test");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  const isMentor = form.role === "mentor";
  const availableCourses = ["Cálculo 1", "Física 1", "Fundamentos del Cálculo"];
  
  // Extraemos el estilo actual para saber cuál resaltar
  const currentStyleId = form.avatar.split("|")[0];
  // Semilla para las previsualizaciones
  const previewSeed = form.name.trim() || "utec";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">
      <div className="card w-full max-w-md bg-slate-900 border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400 mb-6">
          Crear cuenta
        </h1>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SELECTOR DE ROL */}
          <div className="flex gap-4 p-1 bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "student" })}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                !isMentor ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Soy Estudiante
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "mentor" })}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                isMentor ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Soy Mentor
            </button>
          </div>

          {/* ========================================== */}
          {/* GALERÍA DE AVATARES (DICEBEAR) */}
          {/* ========================================== */}
          <div className="border-t border-slate-700 pt-4 mt-2">
            <label className="text-sm font-medium text-slate-300 block mb-3">
              Elige el estilo de tu avatar:
            </label>
            <div className="flex flex-wrap gap-3 justify-center">
              {AVATAR_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleAvatarSelect(style.id)}
                  className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
                    currentStyleId === style.id
                      ? "border-blue-500 scale-110 shadow-lg"
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                  title={style.name}
                >
                  <img 
                    src={getAvatarUrl(style.id, previewSeed)} 
                    alt={style.name} 
                    className="w-full h-full object-cover bg-slate-800"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* CAMPOS COMUNES */}
          <div>
            <label className="text-sm font-medium text-slate-300">Nombre completo</label>
            <input
              name="name"
              className="input-field mt-1"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Correo</label>
            <input
              type="email"
              name="email"
              className="input-field mt-1"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Contraseña</label>
            <input
              type="password"
              name="password"
              className="input-field mt-1"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          {/* CAMPOS EXCLUSIVOS DEL ESTUDIANTE */}
          {!isMentor && (
            <div>
              <label className="text-sm font-medium text-slate-300">Ciclo actual</label>
              <select
                name="cycle"
                className="input-field mt-1"
                value={form.cycle}
                onChange={handleChange}
              >
                {["1","2","3","4","5"].map((c) => (
                  <option key={c} value={c}>Ciclo {c}</option>
                ))}
              </select>
            </div>
          )}

          {/* CAMPOS EXCLUSIVOS DEL MENTOR */}
          {isMentor && (
            <div className="space-y-4 border-t border-slate-700 pt-4 mt-2">
              <div>
                <label className="text-sm font-medium text-slate-300">Ciclo actual (Mínimo 5to)</label>
                <select
                  name="cycle"
                  className="input-field mt-1"
                  value={form.cycle}
                  onChange={handleChange}
                >
                  {["5","6","7","8","9","10"].map((c) => (
                    <option key={c} value={c}>Ciclo {c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Sobre mí (breve biografía)</label>
                <textarea
                  name="bio"
                  className="input-field mt-1 h-20 resize-none"
                  placeholder="Ej: Me gusta explicar Cálculo con ejemplos prácticos."
                  value={form.bio}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Cursos en los que puedo ayudar:</label>
                <div className="space-y-2">
                  {availableCourses.map((course) => (
                    <label key={course} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mentorCourses.includes(course)}
                        onChange={() => handleCourseToggle(course)}
                        className="rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                      />
                      {course}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className={`w-full py-2 rounded-lg font-medium text-white transition ${isMentor ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? "Creando..." : (isMentor ? "Registrarme como Mentor" : "Crear cuenta de Estudiante")}
          </button>
        </form>

        <p className="text-sm text-slate-400 mt-4 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Ingresa
          </Link>
        </p>
      </div>
    </div>
  );
}