import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cycle: "1",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-400 mb-6">
          Crear cuenta
        </h1>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300">Nombre</label>
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
          <div>
            <label className="text-sm font-medium text-slate-300">Ciclo</label>
            <select
              name="cycle"
              className="input-field mt-1"
              value={form.cycle}
              onChange={handleChange}
            >
              {["1","2","3","4","5","6","7","8","9","10"].map((c) => (
                <option key={c} value={c}>Ciclo {c}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creando..." : "Crear cuenta"}
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