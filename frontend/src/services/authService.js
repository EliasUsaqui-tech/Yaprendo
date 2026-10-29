import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  getMe: () => api.get("/auth/me").then((r) => r.data),
  forgotPassword: (data) => api.post("/auth/forgot-password", data).then((r) => r.data),
  
  // NUEVA FUNCIÓN PARA POSTULARSE A MENTOR
  becomeMentor: (data) => api.put("/auth/become-mentor", data).then((r) => r.data),
};