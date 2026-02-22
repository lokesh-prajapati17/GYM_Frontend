import { API_ROUTES } from "../../../services/url_helpers";

export const MEMBER_URLS = {
    BASE: API_ROUTES.MEMBERS,
    BY_ID: (id) => `${API_ROUTES.MEMBERS}/${id}`,
};
