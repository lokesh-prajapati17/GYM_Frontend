import { API_ROUTES } from "../../../services/url_helpers";

export const NOTIFICATION_URLS = {
    BASE: API_ROUTES.NOTIFICATIONS,
    MARK_READ: (id) => `${API_ROUTES.NOTIFICATIONS}/${id}/read`,
    MARK_ALL_READ: `${API_ROUTES.NOTIFICATIONS}/read-all`,
};
