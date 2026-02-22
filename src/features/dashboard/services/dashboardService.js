import apiService from "../../../services/apiService";
import { DASHBOARD_URLS } from "./dashboardUrls";

export const dashboardService = {
    getAdmin: () => apiService.get(DASHBOARD_URLS.ADMIN),
    getTrainer: () => apiService.get(DASHBOARD_URLS.TRAINER),
    getMember: () => apiService.get(DASHBOARD_URLS.MEMBER),
    getTrainers: () => apiService.get(DASHBOARD_URLS.TRAINERS),
    createTrainer: (data) => apiService.post(DASHBOARD_URLS.TRAINERS, data),
};
