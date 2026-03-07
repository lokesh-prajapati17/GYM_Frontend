import apiService from "../../../services/apiService";

export const trainerService = {
    getAll: () => apiService.get("/trainers"),
    getById: (id) => apiService.get(`/trainers/${id}`),
    create: (data) => apiService.post("/trainers", data),
    update: (id, data) => apiService.put(`/trainers/${id}`, data),
    delete: (id) => apiService.delete(`/trainers/${id}`),
};
