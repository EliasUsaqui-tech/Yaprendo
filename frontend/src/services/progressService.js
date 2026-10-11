import api from "./api";

export const progressService = {
  getMine: () => api.get("/progress/me").then((r) => r.data),
  getByCourse: (courseId) =>
    api.get(`/progress/me/course/${courseId}`).then((r) => r.data),
};