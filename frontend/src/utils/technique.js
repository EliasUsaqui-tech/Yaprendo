// Fuente única de la técnica de estudio activa del estudiante.
// Prioridad: la que eligió en un tema o en la página Técnicas > la recomendada por el test > Active Recall.

export const TECHNIQUE_TYPES = ["feynman", "active-recall", "pomodoro", "problem-solving"];

export const TECHNIQUE_LABELS = {
  feynman: "Técnica Feynman",
  "active-recall": "Active Recall",
  pomodoro: "Técnica Pomodoro",
  "problem-solving": "Resolución de Problemas",
};

// El test guarda "recall"; el resto de la app usa "active-recall"
export const normalizeTechnique = (type) => {
  if (!type) return null;
  if (type === "recall") return "active-recall";
  return TECHNIQUE_TYPES.includes(type) ? type : null;
};

const safeGet = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};

export const getActiveTechniqueType = () => {
  const chosen = normalizeTechnique(safeGet("active_technique_type"));
  if (chosen) return chosen;
  try {
    const applied = JSON.parse(safeGet("active_technique") || "null");
    const appliedType = normalizeTechnique(applied?.type);
    if (appliedType) return appliedType;
  } catch { /* valor corrupto: se ignora */ }
  return normalizeTechnique(safeGet("recommended_technique")) || "active-recall";
};

export const setActiveTechniqueType = (type) => {
  const t = normalizeTechnique(type);
  if (!t) return;
  try { localStorage.setItem("active_technique_type", t); } catch { /* sin storage */ }
};
