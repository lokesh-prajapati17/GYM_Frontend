import apiService from "../../../services/apiService";
import { NOTIFICATION_URLS } from "./notificationUrls";

export const notificationService = {
    getAll: (params) => apiService.get(NOTIFICATION_URLS.BASE, params),
    markAsRead: (id) => apiService.put(NOTIFICATION_URLS.MARK_READ(id)),
    markAllAsRead: () => apiService.put(NOTIFICATION_URLS.MARK_ALL_READ),
    create: (data) => apiService.post(NOTIFICATION_URLS.BASE, data),
};
