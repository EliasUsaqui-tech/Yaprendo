import { useEffect, useState } from "react";
import { techniqueService } from "../services/techniqueService";
import Loader from "../components/common/Loader";

export default function Techniques() {
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    techniqueService
      .getAll()
      .then(setTechniques)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">
        Técnicas de estudio activo
      </h1>
      <p className="text-slate-400 mb-6">
        Métodos curados por curso y tema. Prioriza método, no volumen.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {techniques.map((t) => (
          <div key={t._id} className="card">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-slate-100">{t.title}</h2>
              <span className="text-xs bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                {t.type}
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-3">{t.description}</p>
            {t.steps?.length > 0 && (
              <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1 mb-3">
                {t.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            )}
            <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-700">
              <span>{t.course?.name || "General"}</span>
              <span>{t.estimatedMinutes} min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}