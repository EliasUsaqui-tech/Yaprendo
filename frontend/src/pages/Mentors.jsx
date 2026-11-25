import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { mentorService } from "../services/mentorService";
import { getAvatarUrl } from "../utils/avatars"; 
import Loader from "../components/common/Loader";

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Contexto recibido desde la pantalla de resultados del quiz (MVP V2)
  const [params] = useSearchParams();
  const ctxCourse = params.get("course") || "";
  const ctxTopic = params.get("topic") || "";
  const ctxScore = params.get("score") || "";
  const [onlyCourse, setOnlyCourse] = useState(Boolean(ctxCourse));

  useEffect(() => {
    mentorService
      .getAll()
      .then(setMentors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const visibleMentors = onlyCourse && ctxCourse
    ? mentors.filter((m) => m.expertise?.includes(ctxCourse))
    : mentors;

  const buildMailBody = (m) => {
    const base = `Hola ${m.name}, soy estudiante de UTEC y te escribo desde Yaprendo.`;
    if (!ctxCourse) return `${base} Necesito ayuda con el curso.`;
    const scoreTxt = ctxScore ? ` Obtuve ${ctxScore}% en la autoevaluación.` : "";
    return `${base} Necesito reforzar el tema "${ctxTopic}" del curso ${ctxCourse}.${scoreTxt} ¿Podríamos coordinar una asesoría?`;
  };
  const mailSubject = ctxCourse ? `Asesoría Yaprendo: ${ctxCourse} - ${ctxTopic}` : "Solicitud de asesoría en UTEC";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">
        Directorio de mentores
      </h1>
      <p className="text-slate-400 mb-6">
        Conecta con estudiantes de ciclos superiores que ya pasaron por los cursos filtro.
      </p>

      {ctxCourse && (
        <div className="card bg-emerald-950/60 border-emerald-800 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <p className="text-sm text-emerald-200 font-semibold">Solicitud de apoyo desde tu autoevaluación</p>
            <p className="text-sm text-slate-300">
              Curso: <strong>{ctxCourse}</strong> · Tema: <strong>{ctxTopic}</strong>
              {ctxScore && <> · Resultado: <strong>{ctxScore}%</strong></>}
            </p>
            <p className="text-xs text-slate-400 mt-1">El tema se incluirá automáticamente en tu mensaje al mentor.</p>
          </div>
          <label className="text-xs text-slate-300 flex items-center gap-2 whitespace-nowrap">
            <input type="checkbox" checked={onlyCourse} onChange={(e) => setOnlyCourse(e.target.checked)} />
            Solo mentores de {ctxCourse}
          </label>
        </div>
      )}

      {visibleMentors.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-400">
            {onlyCourse && ctxCourse ? `Aún no hay mentores registrados para ${ctxCourse}.` : "Aún no hay mentores disponibles."}
          </p>
          {onlyCourse && ctxCourse && (
            <button onClick={() => setOnlyCourse(false)} className="btn-secondary text-xs mt-3">Ver todos los mentores</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleMentors.map((m) => {
            // Leemos el string de 3 partes: estilo | semilla | color
            // Ejemplo: "bottts|Elias|b6e3f4"
            const avatarData = m.avatar || "bottts||";
            const parts = avatarData.split("|");
            
            const style = parts[0] || "bottts";
            const seed = parts[1] || m.name || "utec";
            const bgColor = parts[2] || "";
            
            const avatarUrl = getAvatarUrl(style, seed, bgColor);

            return (
              <div key={m._id} className="card flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    
                    {/* AVATAR DEL MENTOR */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 bg-slate-800 shrink-0">
                      <img src={avatarUrl} alt={m.name} className="w-full h-full object-cover" />
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
                <div className="flex gap-2 pt-3 border-t border-slate-700">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(m.email)}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(buildMailBody(m))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary text-xs w-full text-center"
                  >
                    {ctxTopic ? "Contactar sobre este tema" : "Contactar por correo"}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}