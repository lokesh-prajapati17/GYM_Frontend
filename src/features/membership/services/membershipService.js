import apiService from "../../../services/apiService";
import { MEMBERSHIP_URLS } from "./membershipUrls";

export const membershipService = {
    getAll: () => apiService.get(MEMBERSHIP_URLS.BASE),
    getById: (id) => apiService.get(MEMBERSHIP_URLS.BY_ID(id)),
    create: (data) => apiService.post(MEMBERSHIP_URLS.BASE, data),
    update: (id, data) => apiService.put(MEMBERSHIP_URLS.BY_ID(id), data),
    delete: (id) => apiService.delete(MEMBERSHIP_URLS.BY_ID(id)),
};
