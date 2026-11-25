import api from "./api";

export const quizService = {
  getAll: (params) => api.get("/quizzes", { params }).then((r) => r.data),
  getById: (id) => api.get(`/quizzes/${id}`).then((r) => r.data),
  submitAttempt: (id, answers, technique) =>
    api.post(`/quizzes/${id}/attempt`, { answers, technique }).then((r) => r.data),
  getMyAttempts: () => api.get("/quizzes/attempts/me").then((r) => r.data),
};