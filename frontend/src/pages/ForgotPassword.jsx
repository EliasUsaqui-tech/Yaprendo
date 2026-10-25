import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await authService.forgotPassword({ email, newPassword });
      setMessage({ text: res.message, type: "success" });
      
      // Después de 2 segundos, lo enviamos al login
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || "Error al recuperar contraseña", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="card w-full max-w-md bg-slate-900 border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400 mb-2">
          Recuperar Contraseña
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Ingresa tu correo y tu nueva contraseña para recuperar el acceso.
        </p>

        {message.text && (
          <div className={`p-3 rounded-lg mb-4 text-sm border ${
            message.type === "success" ? "bg-emerald-950 border-emerald-800 text-emerald-300" : "bg-red-950 border-red-800 text-red-300"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300">Correo registrado</label>
            <input
              type="email"
              className="input-field mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Nueva contraseña</label>
            <input
              type="password"
              className="input-field mt-1"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Cambiando..." : "Cambiar contraseña"}
          </button>
        </form>

        <p className="text-sm text-slate-400 mt-4 text-center">
          ¿Te acordaste? <Link to="/login" className="text-blue-400 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}