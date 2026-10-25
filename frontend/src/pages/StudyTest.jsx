import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudyTest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  // Inicializamos los puntajes
  const [scores, setScores] = useState({ feynman: 0, recall: 0, pomodoro: 0 });

  const questions = [
    {
      q: "1. Cuando tienes que estudiar un tema nuevo, ¿cómo empiezas?",
      options: [
        { text: "Leo el libro o mis apuntes varias veces hasta que me suene.", type: "pomodoro" },
        { text: "Me hago preguntas a mí mismo o busco ejercicios resueltos.", type: "recall" },
        { text: "Intento explicarle el concepto a alguien más para ver si lo entiendo.", type: "feynman" },
      ],
    },
    {
      q: "2. ¿Qué te pasa más seguido al dar un examen?",
      options: [
        { text: "Siento que entendí todo en casa, pero en el examen me quedo en blanco.", type: "pomodoro" },
        { text: "Me confundo si los problemas son diferentes a los que practiqué.", type: "recall" },
        { text: "Me doy cuenta de que no sabía realmente cómo funcionaba la lógica.", type: "feynman" },
      ],
    },
    {
      q: "3. ¿Cómo es tu ambiente de estudio ideal?",
      options: [
        { text: "Silencioso, con mis apuntes subrayados y esquemas ordenados.", type: "pomodoro" },
        { text: "Con exámenes pasados a la mano y tiempo cronometrado.", type: "recall" },
        { text: "Con pizarras o papel donde pueda dibujar y hacer analogías.", type: "feynman" },
      ],
    },
    {
      q: "4. Si te quedas atascado en un problema, ¿qué haces?",
      options: [
        { text: "Reviso mi cuaderno para ver si tengo un ejemplo similar resuelto.", type: "pomodoro" },
        { text: "Intento deducir el primer paso con lo que recuerdo de la teoría.", type: "recall" },
        { text: "Divido el problema en partes más pequeñas para entenderlo mejor.", type: "feynman" },
      ],
    },
    {
      q: "5. ¿Qué tan seguido repasas lo que estudiaste?",
      options: [
        { text: "Casi nunca, suelo estudiar solo los días previos al examen.", type: "pomodoro" },
        { text: "Hago repasos cortos intercalados durante la semana.", type: "recall" },
        { text: "Solo cuando siento que necesito reexplicarme un tema.", type: "feynman" },
      ],
    },
    {
      q: "6. Cuando estudias en grupo, tú sueles...",
      options: [
        { text: "Compartir apuntes o resúmenes para que todos tengan la info.", type: "pomodoro" },
        { text: "Hacerles preguntas al aire para ver quién sabe la respuesta.", type: "recall" },
        { text: "Tomar el rol de 'profesor' y explicarles el tema a los demás.", type: "feynman" },
      ],
    },
  ];

  const handleAnswer = (type) => {
    // Sumamos 1 punto a la técnica elegida
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calcular resultado final (la técnica con más puntos)
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="card w-full max-w-xl bg-slate-900 border-slate-800">
        
        {/* Barra de Progreso */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Test de Diagnóstico</span>
            <span>{step + 1} de {questions.length}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-100 mb-6 leading-snug">
          {questions[step].q}
        </h2>
        
        <div className="space-y-3">
          {questions[step].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.type)}
              className="w-full text-left p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-700 transition text-slate-200 text-sm"
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}