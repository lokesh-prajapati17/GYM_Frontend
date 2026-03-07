import apiService from "../../../services/apiService";
import { ATTENDANCE_URLS } from "./attendanceUrls";

export const attendanceService = {
    getAll: (params) => apiService.get(ATTENDANCE_URLS.BASE, params),
    mark: (data) => apiService.post(ATTENDANCE_URLS.BASE, data),
    addManual: (data) => apiService.post(`${ATTENDANCE_URLS.BASE}/manual`, data),
    getPercentage: (memberId, days) =>
        apiService.get(ATTENDANCE_URLS.PERCENTAGE(memberId), { days }),
};
