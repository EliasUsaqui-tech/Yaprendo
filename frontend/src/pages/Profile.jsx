import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { AVATAR_STYLES, BG_COLORS, getAvatarUrl } from "../utils/avatars";

export default function Profile() {
  const { user, setUser } = useAuth();
  
  // Separamos el estilo y la semilla inicial
  const initialAvatar = user?.avatar || "bottts|utec";
  const [initialStyle, initialSeed] = initialAvatar.split("|");

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  
  // Estados para los filtros
  const [avatarStyle, setAvatarStyle] = useState(initialStyle || "bottts");
  const [seed, setSeed] = useState(initialSeed || user?.name || "utec");
  const [bgColor, setBgColor] = useState(BG_COLORS[0].hex);
  const [accessories, setAccessories] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const generateNewVariation = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setSeed(newSeed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Guardamos el estilo, la semilla y los filtros separados por "|"
    // Formato: "bottts|semilla|bgColor|accessories"
    const avatarString = `${avatarStyle}|${seed}|${bgColor}|${accessories}`;

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

  // Previsualización con los filtros aplicados
  const previewUrl = getAvatarUrl(avatarStyle, seed, bgColor, accessories);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Configuración de Perfil</h1>
      
      {message.text && (
        <div className={`p-3 rounded-lg mb-4 text-center border ${message.type === "success" ? "bg-emerald-950 border-emerald-800 text-emerald-300" : "bg-red-950 border-red-800 text-red-300"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card bg-slate-900 border-slate-800 space-y-6">
        
        {/* ====== PREVISUALIZACIÓN DEL AVATAR ====== */}
        <div className="flex flex-col items-center pb-6 border-b border-slate-800">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-4 shadow-xl bg-slate-800">
            <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>

          <button 
            type="button" 
            onClick={generateNewVariation}
            className="mb-6 text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-white transition flex items-center gap-2 border border-slate-700"
          >
            🔄 Generar otra variación
          </button>

          {/* ====== FILTROS: COLOR DE FONDO ====== */}
          <div className="w-full mb-4">
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

          {/* ====== FILTROS: ACCESORIOS ====== */}
          <div className="w-full mb-6">
            <label className="text-xs font-medium text-slate-400 block mb-2 text-center">Accesorios</label>
            <div className="flex gap-2 justify-center">
              <button type="button" onClick={() => setAccessories("")} className={`px-3 py-1 rounded text-xs border ${accessories === "" ? "bg-blue-600 border-blue-500" : "border-slate-700 text-slate-400"}`}>Aleatorio</button>
              <button type="button" onClick={() => setAccessories("glasses")} className={`px-3 py-1 rounded text-xs border ${accessories === "glasses" ? "bg-blue-600 border-blue-500" : "border-slate-700 text-slate-400"}`}>Lentes 👓</button>
              <button type="button" onClick={() => setAccessories("none")} className={`px-3 py-1 rounded text-xs border ${accessories === "none" ? "bg-blue-600 border-blue-500" : "border-slate-700 text-slate-400"}`}>Sin accesorios</button>
            </div>
          </div>

          {/* ====== GALERÍA DE ESTILOS ====== */}
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
                <img src={getAvatarUrl(style.id, seed, bgColor, accessories)} alt={style.name} className="w-full h-full object-cover bg-slate-800" />
              </button>
            ))}
          </div>
        </div>

        {/* ====== DATOS DEL PERFIL ====== */}
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
    </div>
  );
}