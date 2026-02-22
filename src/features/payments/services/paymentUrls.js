import { API_ROUTES } from "../../../services/url_helpers";

export const PAYMENT_URLS = {
    BASE: API_ROUTES.PAYMENTS,
    BY_ID: (id) => `${API_ROUTES.PAYMENTS}/${id}`,
    REVENUE_STATS: `${API_ROUTES.PAYMENTS}/stats/revenue`,
};
