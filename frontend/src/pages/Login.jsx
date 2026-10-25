import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import loginBg from "../assets/utec2.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      />

      {/* Capa oscura semitransparente */}
      <div className="absolute inset-0 bg-slate-950/10" />

      {/* Recuadro del login */}
      <div className="glass-card rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl">
        <h1 className="text-2xl font-bold text-blue-400 mb-1">
          Acompañamiento UTEC
        </h1>
        <p className="text-slate-300 text-sm mb-6">
          Estudia con método. Autoevalúa tu comprensión real.
        </p>

        {error && (
          <div className="bg-red-950/80 border border-red-800 text-red-300 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-200">Correo</label>
            <input
              type="email"
              className="input-field mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-200">
              Contraseña
            </label>
            <input
              type="password"
              className="input-field mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="flex justify-between items-center mt-2">
            <Link to="/forgot-password" className="text-xs text-slate-400 hover:text-blue-400 transition">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

        <p className="text-sm text-slate-300 mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Regístrate
          </Link>
        </p>

        <div className="mt-4 pt-4 border-t border-slate-600/50 text-xs text-slate-400 text-center">
          Demo: leonardo@utec.edu.pe / leonardo123
        </div>
      </div>
    </div>
  );
}