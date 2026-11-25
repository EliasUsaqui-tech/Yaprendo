import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizService } from "../services/quizService";
import Loader from "../components/common/Loader";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    quizService
      .getById(id)
      .then(setQuiz)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelect = (questionId, index) =>
    setAnswers({ ...answers, [questionId]: index });

  const handleSubmit = async () => {
    const payload = Object.entries(answers).map(
      ([questionId, selectedIndex]) => ({ questionId, selectedIndex })
    );
    setSubmitting(true);
    try {
      const res = await quizService.submitAttempt(id, payload);
      setResult(res);
    } catch (err) {
      alert(err.response?.data?.message || "Error al enviar respuestas");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!quiz)
    return <p className="text-center py-12 text-slate-300">Quiz no encontrado</p>;

  const answeredAll =
    quiz.questions?.length > 0 &&
    Object.keys(answers).length === quiz.questions.length;

  if (result) {
    const passed = result.score >= 70;
    // Contexto que viaja a los siguientes módulos de la ruta guiada
    const ctx = {
      courseId: quiz.course?._id || "",
      course: quiz.course?.name || "",
      topicId: quiz.topic?._id || "",
      topic: quiz.topic?.name || "",
      score: String(result.score),
    };
    const practiceParams = new URLSearchParams(ctx).toString();
    const mentorParams = new URLSearchParams({ course: ctx.course, topic: ctx.topic, score: ctx.score }).toString();
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div
          className={`card text-center ${
            passed
              ? "bg-green-950 border-green-800"
              : "bg-orange-950 border-orange-800"
          }`}
        >
          <p className="text-5xl mb-2">{passed ? "🎉" : "💪"}</p>
          <h1 className="text-3xl font-bold text-slate-100 mb-1">
            {result.score}% de acierto
          </h1>
          <p className="text-slate-300">
            {result.correctAnswers} de {result.totalQuestions} correctas
          </p>
          <p className="text-sm text-slate-400 mt-2">
            {passed
              ? "¡Buen trabajo! Continúa con el siguiente tema."
              : "Repasa el tema y vuelve a intentarlo. La repetición espaciada ayuda."}
          </p>
        </div>

        <h2 className="text-lg font-semibold mt-8 mb-3 text-slate-100">
          Retroalimentación por pregunta
        </h2>

        <div className="space-y-3">
          {quiz.questions.map((q, i) => {
            const fb = result.feedback.find((f) => f.questionId === q._id);
            return (
              <div key={q._id} className="card">
                <p className="font-medium text-slate-100 mb-1">
                  {i + 1}. {q.statement}
                </p>
                <p className="text-sm">
                  {fb?.correct ? (
                    <span className="text-green-400">✅ Correcta</span>
                  ) : (
                    <span className="text-red-400">
                      ❌ Incorrecta — la respuesta era:{" "}
                      <strong>{q.options[fb?.correctIndex]}</strong>
                    </span>
                  )}
                </p>
                {fb?.explanation && (
                  <p className="text-xs text-slate-400 mt-2 italic">
                    {fb.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* ====== NODO DE DECISIÓN POST-QUIZ (MVP V2) ======
            Hallazgos 2.2.3 y 2.2.4 de la Ronda 01: el quiz ya no es un punto muerto.
            Salida 1: refuerzo autónomo (Sesión Dinámica con el tema precargado).
            Salida 2: acompañamiento entre pares (mentores filtrados por curso + tema). */}
        <div className="card mt-8 bg-slate-900 border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100 mb-1">¿Qué sigue?</h2>
          <p className="text-sm text-slate-400 mb-4">
            {passed
              ? "Refuerza lo aprendido practicando el tema, o pasa a tu progreso."
              : "Te recomendamos practicar este tema con tu técnica o pedir apoyo a un mentor."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => navigate(`/custom-study?${practiceParams}`)}
              className="btn-primary py-3"
            >
              🧠 Practicar este tema
            </button>
            <button
              onClick={() => navigate(`/mentors?${mentorParams}`)}
              className={`${passed ? "btn-secondary" : "btn-primary bg-emerald-600 hover:bg-emerald-500"} py-3`}
            >
              🤝 Contactar mentor sobre este tema
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => navigate(quiz.course?._id ? `/courses/${quiz.course._id}` : "/courses")}
            className="btn-secondary"
          >
            Volver al curso
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary"
          >
            Reintentar quiz
          </button>
          <button onClick={() => navigate("/progress")} className="btn-secondary">
            Ver mi progreso
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

            {/* BOTÓN PARA SALIR DEL QUIZ */}
      <button 
        onClick={() => navigate("/courses")} 
        className="text-sm text-slate-400 hover:text-white mb-4 flex items-center gap-2 transition"
      >
        ← Salir del Quiz y volver a cursos
      </button>
      
      <h1 className="text-2xl font-bold text-slate-100 mb-1">{quiz.title}</h1>
      <p className="text-slate-400 mb-6">{quiz.description}</p>

      <div className="space-y-4">
        {quiz.questions.map((q, i) => (
          <div key={q._id} className="card">
            <p className="font-medium text-slate-100 mb-3">
              {i + 1}. {q.statement}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(q._id, idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition text-sm ${
                    answers[q._id] === idx
                      ? "border-blue-500 bg-blue-950 text-blue-200"
                      : "border-slate-700 hover:border-slate-500 text-slate-200"
                  }`}
                >
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!answeredAll || submitting}
        className={`mt-6 w-full py-3 rounded-lg font-medium transition ${
          answeredAll && !submitting
            ? "btn-primary"
            : "bg-slate-800 text-slate-500 cursor-not-allowed"
        }`}
      >
        {submitting
          ? "Evaluando..."
          : answeredAll
          ? "Enviar respuestas"
          : `Faltan ${
              quiz.questions.length - Object.keys(answers).length
            } respuestas`}
      </button>
    </div>
  );
}