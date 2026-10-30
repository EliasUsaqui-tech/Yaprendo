import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudyTest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  
  // Inicializamos los puntajes
  const [scores, setScores] = useState({ feynman: 0, recall: 0, pomodoro: 0 });

  const questions = [
    {
      q: "Cuando tienes que estudiar un tema nuevo, ¿cómo empiezas?",
      options: [
        { text: "Leo mis apuntes varias veces hasta que me suene todo. 📖", type: "pomodoro" },
        { text: "Me hago preguntas a mí mismo o busco ejercicios. ✍️", type: "recall" },
        { text: "Intento explicárselo a alguien más para ver si lo entiendo. 🗣️", type: "feynman" },
      ],
    },
    {
      q: "¿Qué te pasa más seguido justo en el momento del examen?",
      options: [
        { text: "Siento que entendí en casa, pero en el examen me quedo en blanco. 😰", type: "pomodoro" },
        { text: "Me confundo si los problemas son diferentes a los que practiqué. 🤔", type: "recall" },
        { text: "Me doy cuenta de que no sabía realmente cómo funcionaba la lógica. 💡", type: "feynman" },
      ],
    },
    {
      q: "¿Cómo te gusta armar tu ambiente de estudio ideal?",
      options: [
        { text: "Silencioso, con apuntes ordenados y mis colores. 🎧", type: "pomodoro" },
        { text: "Con exámenes pasados a la mano y un reloj corriendo. ⏱️", type: "recall" },
        { text: "Con pizarras o papel para dibujar y hacer analogías. 🎨", type: "feynman" },
      ],
    },
    {
      q: "Si te quedas atascado en un problema difícil, ¿qué haces?",
      options: [
        { text: "Reviso mi cuaderno para ver si tengo un ejemplo similar. 🔍", type: "pomodoro" },
        { text: "Intento deducir el primer paso con lo que recuerdo. 🧠", type: "recall" },
        { text: "Divido el problema en partes más pequeñas. 🧩", type: "feynman" },
      ],
    },
    {
      q: "¿Qué tan seguido repasas lo que estudiaste?",
      options: [
        { text: "Casi nunca, suelo estudiar solo días antes del examen. 😅", type: "pomodoro" },
        { text: "Hago repasos cortos y constantes durante la semana. 📅", type: "recall" },
        { text: "Solo cuando siento que necesito reexplicarme algo. 🗣️", type: "feynman" },
      ],
    },
    {
      q: "Cuando estudias en grupo, tú sueles...",
      options: [
        { text: "Compartir apuntes o resúmenes para que todos tengan la info. 📄", type: "pomodoro" },
        { text: "Hacerles preguntas al aire para ver quién sabe qué. ❓", type: "recall" },
        { text: "Tomar el rol de 'profe' y explicarles el tema a los demás. 🧑‍🏫", type: "feynman" },
      ],
    },
  ];

  const handleAnswer = (type) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);
    
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      let bestTechnique = "recall";
      let maxScore = -1;
      
      for (const [key, value] of Object.entries(newScores)) {
        if (value > maxScore) {
          maxScore = value;
          bestTechnique = key;
        }
      }

      localStorage.setItem("recommended_technique", bestTechnique);
      navigate("/recommendation");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">
      <div className="card w-full max-w-xl bg-slate-900 border-slate-800 shadow-2xl">
        
        {/* PANTALLA DE BIENVENIDA (PASO 0) */}
        {step === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">👋</div>
            <h1 className="text-3xl font-bold text-slate-100 mb-4">
              ¡Hola! Descubramos cómo estudias.
            </h1>
            <p className="text-slate-400 mb-8 px-4">
              Responde con total sinceridad. Esto no es un examen y no hay respuestas buenas ni malas. Solo queremos conocerte para recomendarte la mejor técnica de estudio para ti.
            </p>
            <button 
              onClick={() => setStep(1)} 
              className="btn-primary px-8 py-3 text-lg rounded-xl shadow-lg"
            >
              ¡Empecemos! 🚀
            </button>
          </div>
        ) : (
          /* PANTALLA DE PREGUNTAS (PASO 1 AL 6) */
          <>
            {/* Barra de Progreso */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Tu perfil de estudio</span>
                <span>Pregunta {step} de {questions.length}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-100 mb-6 leading-snug">
              {questions[step - 1].q}
            </h2>
            
            <div className="space-y-3">
              {questions[step - 1].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.type)}
                  className="w-full text-left p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-700 transition text-slate-200 text-base shadow-sm flex items-center gap-2"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}