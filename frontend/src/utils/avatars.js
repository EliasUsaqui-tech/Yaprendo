export const AVATAR_STYLES = [
  { id: "bottts", name: "Robot" },
  { id: "adventurer", name: "Aventurero" },
  { id: "avataaars", name: "Persona" },
  { id: "big-smile", name: "Sonrisa" },
  { id: "lorelei", name: "Ilustración" },
  { id: "pixel-art", name: "Pixel Art" },
];

export const BG_COLORS = [
  { name: "Azul", hex: "b6e3f4" },
  { name: "Lila", hex: "c0aede" },
  { name: "Verde", hex: "d1f4d9" },
  { name: "Naranja", hex: "ffdfbf" },
  { name: "Rojo", hex: "ffd5dc" },
  { name: "Gris", hex: "e2e8f0" },
];

export const getAvatarUrl = (styleId, seed = "default", bgColor = "") => {
  let url = `https://api.dicebear.com/9.x/${styleId}/svg?seed=${seed}`;
  if (bgColor) url += `&backgroundColor=${bgColor}`;
  return url;
};