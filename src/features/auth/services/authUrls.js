import { API_ROUTES } from "../../../services/url_helpers";

export const AUTH_URLS = {
    LOGIN: `${API_ROUTES.AUTH}/login`,
    REGISTER: `${API_ROUTES.AUTH}/register`,
    SELECT_BRANCH: `${API_ROUTES.AUTH}/select-branch`,
    GET_ME: `${API_ROUTES.AUTH}/me`,
    UPDATE_PROFILE: `${API_ROUTES.AUTH}/profile`,
    CHANGE_PASSWORD: `${API_ROUTES.AUTH}/password`,
};
