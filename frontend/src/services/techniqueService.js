import api from "./api";

export const techniqueService = {
  getAll: (params) => api.get("/techniques", { params }).then((r) => r.data),
  getById: (id) => api.get(`/techniques/${id}`).then((r) => r.data),
};