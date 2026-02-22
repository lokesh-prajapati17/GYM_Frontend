import { API_ROUTES } from "../../../services/url_helpers";

export const FLOOR_URLS = {
    BASE: API_ROUTES.FLOORS,
    BY_ID: (id) => `${API_ROUTES.FLOORS}/${id}`,
    HOTSPOTS: (id) => `${API_ROUTES.FLOORS}/${id}/hotspots`,
};
