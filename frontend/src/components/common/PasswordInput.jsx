import { useState } from "react";

// Campo de contraseña con botón "Mostrar/Ocultar" (mejora V2, hallazgo 2.2.2 de la Ronda 01)
export default function PasswordInput({ value, onChange, name = "password", minLength, required = true, showHint = false }) {
  const [visible, setVisible] = useState(false);
  const tooShort = minLength && value.length > 0 && value.length < minLength;

  return (
    <div>
      <div className="relative mt-1">
        <input
          type={visible ? "text" : "password"}
          name={name}
          className="input-field pr-20"
          value={value}
          onChange={onChange}
          minLength={minLength}
          required={required}
          autoComplete={name === "password" ? "current-password" : "new-password"}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-2 my-auto h-7 px-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-600 rounded-md transition"
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      {showHint && tooShort && (
        <p className="text-xs text-orange-300 mt-1">
          La contraseña debe tener al menos {minLength} caracteres ({value.length}/{minLength}).
        </p>
      )}
    </div>
  );
}
