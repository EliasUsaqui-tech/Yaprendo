import api from "./api";

export const mentorService = {
  getAll: (params) => api.get("/mentors", { params }).then((r) => r.data),
  getById: (id) => api.get(`/mentors/${id}`).then((r) => r.data),
};