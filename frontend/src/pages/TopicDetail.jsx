import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/common/Loader";

export default function TopicDetail() {
  const { id } = useParams(); // ID del tema
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [technique, setTechnique] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hacemos las peticiones para traer el tema, su técnica recomendada y su quiz
    Promise.all([
      // Asumimos que podemos buscar el tema por su ID
      api.get(`/courses/topics/${id}`).then(r => r.data).catch(() => null),
      api.get(`/techniques?topic=${id}`).then(r => r.data),
      api.get(`/quizzes?topic=${id}`).then(r => r.data)
    ])
      .then(([topicData, techData, quizData]) => {
        // Si el backend no tiene la ruta /courses/topics/:id, usamos un fallback temporal
        setTopic(topicData || { name: "Detalle del tema", description: "Estudiando...", course: "" }); 
        setTechnique(techData && techData.length > 0 ? techData[0] : null);
        setQuiz(quizData && quizData.length > 0 ? quizData[0] : null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-400 hover:underline mb-4 block">
        ← Volver al curso
      </button>

      <h1 className="text-3xl font-bold text-slate-100 mb-2">{topic?.name}</h1>
      <p className="text-slate-400 mb-8">{topic?.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ====== TARJETA DE LA TÉCNICA RECOMENDADA ====== */}
        <div className="card bg-gradient-to-br from-purple-950 to-slate-900 border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🧠</span>
            <h2 className="text-lg font-semibold text-purple-200">
              Técnica recomendada
            </h2>
          </div>
          {technique ? (
            <>
              <h3 className="font-bold text-slate-100 text-xl mb-2">{technique.title}</h3>
              <p className="text-sm text-slate-300 mb-4">{technique.description}</p>
              
              <div className="bg-slate-900/50 p-3 rounded-lg border border-purple-900/50 mb-4">
                <p className="text-xs font-semibold text-purple-300 mb-2">Pasos a seguir:</p>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                  {technique.steps?.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>

              <Link to="/techniques" className="btn-secondary text-xs inline-block w-full text-center">
                Ver todas las técnicas
              </Link>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">Aún no hay una técnica sugerida para este tema.</p>
              <Link to="/techniques" className="text-blue-400 text-xs hover:underline mt-2 inline-block">
                Explorar biblioteca de técnicas
              </Link>
            </div>
          )}
        </div>

        {/* ====== TARJETA DE LA AUTOEVALUACIÓN ====== */}
        <div className="card bg-gradient-to-br from-blue-950 to-slate-900 border-blue-800 flex flex-col justify-center items-center text-center">
          <span className="text-4xl mb-4">📝</span>
          <h2 className="text-lg font-semibold text-blue-200 mb-2">
            Comprueba tu nivel
          </h2>
          <p className="text-sm text-slate-300 mb-6 px-4">
            Realiza la autoevaluación de este tema para saber si necesitas repasar antes del examen.
          </p>
          
          {quiz ? (
            <Link to={`/quiz/${quiz._id}`} className="btn-primary w-full max-w-[200px]">
              Empezar autoevaluación
            </Link>
          ) : (
            <div className="bg-slate-800 p-3 rounded-lg w-full">
              <p className="text-sm text-slate-500">Aún no hay un quiz disponible para esta semana.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}