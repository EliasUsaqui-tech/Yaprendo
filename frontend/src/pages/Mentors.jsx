import { useEffect, useState } from "react";
import { mentorService } from "../services/mentorService";
import Loader from "../components/common/Loader";

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mentorService
      .getAll()
      .then(setMentors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">
        Directorio de mentores
      </h1>
      <p className="text-slate-400 mb-6">
        Conecta con estudiantes de ciclos superiores que ya pasaron por los
        cursos filtro.
      </p>

      {mentors.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-400">Aún no hay mentores disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((m) => (
            <div key={m._id} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-utec-primary text-white flex items-center justify-center font-bold text-lg">
                  {m.user?.name?.charAt(0) || "?"}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-100">
                    {m.user?.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Ciclo {m.user?.cycle}
                  </p>
                </div>
              </div>
              {m.bio && (
                <p className="text-sm text-slate-300 mb-3">{m.bio}</p>
              )}
              {m.courses?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {m.courses.map((c) => (
                    <span
                      key={c._id}
                      className="text-xs bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-3 border-t border-slate-700">
                {m.contactEmail && (
                  <a
                    href={`mailto:${m.contactEmail}`}
                    className="btn-secondary text-xs flex-1 text-center"
                  >
                    Correo
                  </a>
                )}
                {m.contactLink && (
                  <a
                    href={m.contactLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs flex-1 text-center"
                  >
                    Contactar
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}