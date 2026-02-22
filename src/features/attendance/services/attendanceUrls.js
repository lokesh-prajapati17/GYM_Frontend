import { API_ROUTES } from "../../../services/url_helpers";

export const ATTENDANCE_URLS = {
    BASE: API_ROUTES.ATTENDANCE,
    PERCENTAGE: (memberId) => `${API_ROUTES.ATTENDANCE}/percentage/${memberId}`,
};
