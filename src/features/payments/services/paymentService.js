import apiService from "../../../services/apiService";
import { PAYMENT_URLS } from "./paymentUrls";

export const paymentService = {
    getAll: (params) => apiService.get(PAYMENT_URLS.BASE, params),
    create: (data) => apiService.post(PAYMENT_URLS.BASE, data),
    update: (id, data) => apiService.put(PAYMENT_URLS.BY_ID(id), data),
    getRevenueStats: () => apiService.get(PAYMENT_URLS.REVENUE_STATS),
};
