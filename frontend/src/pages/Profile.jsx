import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { AVATARS } from "../utils/avatars"; // Asegúrate de haber creado este archivo

export default function Profile() {
  const { user, setUser } = useAuth();
  
  // Estados locales para el formulario
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "avatar_1"); // Avatar por defecto
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Enviamos los datos al backend (asegúrate de tener la ruta PUT /api/auth/profile)
      const { data } = await api.put("/auth/profile", {
        name,
        bio,
        avatar,
      });

      // Actualizamos el contexto global para que el Navbar y otras vistas se enteren
      setUser(data); 
      
      setMessage({ text: "Perfil actualizado con éxito ✅", type: "success" });
    } catch (error) {
      console.error(error);
      setMessage({ text: "Error al actualizar el perfil ❌", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">
        Configuración de Perfil
      </h1>
      
      {/* Mensajes de éxito o error */}
      {message.text && (
        <div className={`p-3 rounded-lg mb-4 text-center border ${
          message.type === "success" 
            ? "bg-emerald-950 border-emerald-800 text-emerald-300" 
            : "bg-red-950 border-red-800 text-red-300"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card bg-slate-900 border-slate-800 space-y-6">
        
        {/* ====== GALERÍA DE AVATARES ====== */}
        <div className="flex flex-col items-center pb-6 border-b border-slate-800">
          <h3 className="text-sm font-medium text-slate-300 mb-4">
            Elige tu avatar
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {AVATARS.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => setAvatar(av.id)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
                  avatar === av.id
                    ? "ring-4 ring-blue-500 scale-110 shadow-lg"
                    : "opacity-60 hover:opacity-100 hover:scale-105"
                } ${av.bg}`}
              >
                {av.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* ====== DATOS DEL PERFIL ====== */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300">Nombre</label>
            <input
              type="text"
              className="input-field mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Correo</label>
            <input
              type="email"
              className="input-field mt-1 opacity-50 cursor-not-allowed"
              value={user?.email || ""}
              disabled
              title="El correo no se puede cambiar"
            />
          </div>

          {/* Solo mostramos la biografía si el usuario es Mentor */}
          {user?.role === "mentor" && (
            <div>
              <label className="text-sm font-medium text-slate-300">
                Sobre mí (Biografía para el Directorio)
              </label>
              <textarea
                className="input-field mt-1 h-28 resize-none"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ej: Me gusta explicar Cálculo con ejemplos prácticos."
              />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="btn-primary w-full"
        >
          {loading ? "Guardando cambios..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}