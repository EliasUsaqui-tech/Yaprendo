import { useEffect, useState } from "react";
import { mentorService } from "../services/mentorService";
import Loader from "../components/common/Loader";
import { AVATARS } from "../utils/avatars"; // Importar


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
        Conecta con estudiantes de ciclos superiores que ya pasaron por los cursos filtro.
      </p>

      {mentors.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-400">Aún no hay mentores disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((m) => (
            <div key={m._id} className="card flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${AVATARS.find(a => a.id === m.avatar)?.bg || "bg-emerald-600"}`}>
                    {AVATARS.find(a => a.id === m.avatar)?.emoji || m.name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-100">
                      {m.name}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Ciclo {m.cycle}
                    </p>
                  </div>
                </div>
                
                {/* Biografía */}
                {m.bio && (
                  <p className="text-sm text-slate-300 mb-3">{m.bio}</p>
                )}

                {/* Cursos que domina */}
                {m.expertise?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {m.expertise.map((course, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-700 text-slate-200 border border-slate-600 px-2 py-0.5 rounded"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón de contacto */}
              {/* Botón de contacto por Gmail */}
              <div className="flex gap-2 pt-3 border-t border-slate-700">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${m.email}&su=Solicitud de asesoría en UTEC&body=Hola ${m.name}, soy estudiante de UTEC y necesito ayuda con el curso.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs w-full text-center flex items-center justify-center gap-2"
                >
                  Contactar por correo
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}