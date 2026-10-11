import api from "./api";

export const courseService = {
  getAll: () => api.get("/courses").then((r) => r.data),
  getById: (id) => api.get(`/courses/${id}`).then((r) => r.data),
  getTopics: (id) => api.get(`/courses/${id}/topics`).then((r) => r.data),
};