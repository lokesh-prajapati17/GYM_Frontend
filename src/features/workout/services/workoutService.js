import apiService from "../../../services/apiService";
import { WORKOUT_URLS } from "./workoutUrls";

export const workoutService = {
    getAll: (params) => apiService.get(WORKOUT_URLS.BASE, params),
    create: (data) => apiService.post(WORKOUT_URLS.BASE, data),
    update: (id, data) => apiService.put(WORKOUT_URLS.BY_ID(id), data),
    delete: (id) => apiService.delete(WORKOUT_URLS.BY_ID(id)),
};
