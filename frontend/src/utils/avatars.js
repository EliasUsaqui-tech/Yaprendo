// Los 6 estilos "molones" que ofreceremos
export const AVATAR_STYLES = [
  { id: "bottts", name: "Robot" },
  { id: "adventurer", name: "Aventurero" },
  { id: "avataaars", name: "Persona" },
  { id: "big-smile", name: "Sonrisa" },
  { id: "lorelei", name: "Ilustración" },
  { id: "pixel-art", name: "Pixel Art" },
];

// Función para obtener la URL de la imagen
// Recibe el estilo y la semilla (que será el ID del usuario o un número aleatorio)
export const getAvatarUrl = (styleId, seed = "default") => {
  return `https://api.dicebear.com/9.x/${styleId}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};