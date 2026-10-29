import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { authService } from "../services/authService"; // <-- Importamos el servicio
import { AVATAR_STYLES, BG_COLORS, getAvatarUrl } from "../utils/avatars";

export default function Profile() {
  const { user, setUser } = useAuth();
  
  // TRUCO: Si el usuario no tiene avatar, le asignamos uno por defecto válido
  const initialAvatar = user?.avatar && user.avatar.includes("|") 
    ? user.avatar 
    : "bottts|utec|b6e3f4";

  const avatarParts = initialAvatar.split("|");
  const initialStyle = avatarParts[0] || "bottts";
  const initialSeed = avatarParts[1] || user?.name || "utec";
  const initialBgColor = avatarParts[2] || BG_COLORS[0].hex;

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  
  const [avatarStyle, setAvatarStyle] = useState(initialStyle);
  const [seed, setSeed] = useState(initialSeed);
  const [bgColor, setBgColor] = useState(initialBgColor);
  
  // Diccionario para guardar el historial de variaciones por estilo
  const [seeds, setSeeds] = useState(() => {
    const initialSeeds = {};
    AVATAR_STYLES.forEach(style => {
      initialSeeds[style.id] = [initialSeed];
    });
    return initialSeeds;
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = {};
    AVATAR_STYLES.forEach(style => { idx[style.id] = 0; });
    return idx;
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Estados para la postulación a mentor
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [mentorBio, setMentorBio] = useState("");
  const [mentorCourses, setMentorCourses] = useState(["Cálculo 1"]);

  const handleNextVariation = (styleId) => {
    const newSeed = Math.random().toString(36).substring(7);
    setSeeds(prev => ({
      ...prev,
      [styleId]: [...prev[styleId], newSeed]
    }));
    setCurrentIndex(prev => ({
      ...prev,
      [styleId]: prev[styleId] + 1
    }));
  };

  const handlePrevVariation = (styleId) => {
    if (currentIndex[styleId] > 0) {
      setCurrentIndex(prev => ({
        ...prev,
        [styleId]: prev[styleId] - 1
      }));
    }
  };

  const currentSeed = seeds[avatarStyle][currentIndex[avatarStyle]];
  const canGoBack = currentIndex[avatarStyle] > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const avatarString = `${avatarStyle}|${currentSeed}|${bgColor}`;

    try {
      const { data } = await api.put("/auth/profile", { name, bio, avatar: avatarString });
      setUser(data); 
      setMessage({ text: "Perfil actualizado con éxito ✅", type: "success" });
    } catch (error) {
      console.error(error);
      setMessage({ text: "Error al actualizar el perfil ❌", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeMentor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.becomeMentor({
        bio: mentorBio,
        expertise: mentorCourses
      });
      setUser(data); // Actualizamos el contexto global
      // Forzamos recarga para que el Navbar y rutas cambien al nuevo rol
      window.location.href = "/mentor-panel"; 
    } catch (error) {
      alert(error.response?.data?.message || "Error al postularse");
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = getAvatarUrl(avatarStyle, currentSeed, bgColor);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Configuración de Perfil</h1>
      
      {message.text && (
        <div className={`p-3 rounded-lg mb-4 text-center border ${message.type === "success" ? "bg-emerald-950 border-emerald-800 text-emerald-300" : "bg-red-950 border-red-800 text-red-300"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card bg-slate-900 border-slate-800 space-y-6">
        
        <div className="flex flex-col items-center pb-6 border-b border-slate-800">
          
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-4 shadow-xl bg-slate-800">
            <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button 
              type="button" 
              onClick={() => handlePrevVariation(avatarStyle)}
              disabled={!canGoBack}
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition ${
                canGoBack ? "bg-slate-800 border-slate-600 text-white hover:bg-slate-700" : "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              ←
            </button>
            <span className="text-xs text-slate-400 font-medium">Variación {currentIndex[avatarStyle] + 1}</span>
            <button 
              type="button" 
              onClick={() => handleNextVariation(avatarStyle)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 border border-blue-500 text-white hover:bg-blue-500 transition shadow-lg"
            >
              →
            </button>
          </div>

          <div className="w-full mb-6">
            <label className="text-xs font-medium text-slate-400 block mb-2 text-center">Color de fondo</label>
            <div className="flex gap-2 justify-center">
              {BG_COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setBgColor(color.hex)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    bgColor === color.hex ? "border-white scale-110" : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: `#${color.hex}` }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <h3 className="text-sm font-medium text-slate-400 mb-3">Estilos base:</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {AVATAR_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setAvatarStyle(style.id)}
                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                  avatarStyle === style.id ? "border-blue-500 scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                }`}
                title={style.name}
              >
                <img 
                  src={getAvatarUrl(style.id, seeds[style.id][currentIndex[style.id]], bgColor)} 
                  alt={style.name} 
                  className="w-full h-full object-cover bg-slate-800" 
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300">Nombre</label>
            <input type="text" className="input-field mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Correo</label>
            <input type="email" className="input-field mt-1 opacity-50 cursor-not-allowed" value={user?.email || ""} disabled />
          </div>

          {user?.role === "mentor" && (
            <div>
              <label className="text-sm font-medium text-slate-300">Sobre mí (Biografía)</label>
              <textarea className="input-field mt-1 h-28 resize-none" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Guardando cambios..." : "Guardar Cambios"}
        </button>
      </form>

      {/* ========================================== */}
      {/* TARJETA PARA POSTULARSE A MENTOR */}
      {/* Solo se muestra si el rol es "student" */}
      {/* ========================================== */}
      {user?.role === "student" && (
        <div className="card mt-8 bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-800">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎓</span>
            <h2 className="text-lg font-bold text-emerald-300">¿Ya pasaste los cursos filtro?</h2>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            Postúlate como mentor para ayudar a los nuevos ingresos de UTEC. Comparte tu experiencia y refuerza tus conocimientos.
          </p>

          {!showMentorForm ? (
            <button 
              onClick={() => setShowMentorForm(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Quiero ser Mentor
            </button>
          ) : (
            <form onSubmit={handleBecomeMentor} className="bg-slate-900/50 p-4 rounded-lg border border-emerald-900/50 mt-4 space-y-4">
              <div>
                <label className="text-sm text-slate-300">Cuéntanos sobre ti (Biografía)</label>
                <textarea
                  className="input-field mt-1 h-20 resize-none"
                  value={mentorBio}
                  onChange={(e) => setMentorBio(e.target.value)}
                  placeholder="Ej: Estudiante de 5to ciclo, me gusta explicar con ejemplos prácticos."
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm py-2 px-4 rounded-lg flex-1">
                  {loading ? "Postulando..." : "Enviar Postulación"}
                </button>
                <button type="button" onClick={() => setShowMentorForm(false)} className="bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 px-4 rounded-lg">
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}