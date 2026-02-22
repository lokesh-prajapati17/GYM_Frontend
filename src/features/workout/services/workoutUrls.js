import { API_ROUTES } from "../../../services/url_helpers";

export const WORKOUT_URLS = {
    BASE: API_ROUTES.WORKOUTS,
    BY_ID: (id) => `${API_ROUTES.WORKOUTS}/${id}`,
};
