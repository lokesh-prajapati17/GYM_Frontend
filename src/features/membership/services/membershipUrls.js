import { API_ROUTES } from "../../../services/url_helpers";

export const MEMBERSHIP_URLS = {
    BASE: API_ROUTES.MEMBERSHIPS,
    BY_ID: (id) => `${API_ROUTES.MEMBERSHIPS}/${id}`,
};
