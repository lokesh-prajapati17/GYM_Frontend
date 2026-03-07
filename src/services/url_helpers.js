export const API_ROUTES = {
    AUTH: "/auth",
    MEMBERS: "/members",
    MEMBERSHIPS: "/memberships",
    PAYMENTS: "/payments",
    ATTENDANCE: "/attendance",
    WORKOUTS: "/workouts",
    NOTIFICATIONS: "/notifications",
    DASHBOARD: "/dashboard",
    FLOORS: "/floors"
};


export const url_helpers = {
    LOGIN: `${API_ROUTES.AUTH}/login`,
    REGISTER: `${API_ROUTES.AUTH}/register`,
    SELECT_BRANCH: `${API_ROUTES.AUTH}/select-branch`,
    GET_ME: `${API_ROUTES.AUTH}/me`,
    UPDATE_PROFILE: `${API_ROUTES.AUTH}/profile`,
    CHANGE_PASSWORD: `${API_ROUTES.AUTH}/password`,
    MEMBERS: `${API_ROUTES.MEMBERS}`,
    MEMBERSHIPS: `${API_ROUTES.MEMBERSHIPS}`,
    PAYMENTS: `${API_ROUTES.PAYMENTS}`,
    ATTENDANCE: `${API_ROUTES.ATTENDANCE}`,
    WORKOUTS: `${API_ROUTES.WORKOUTS}`,
    NOTIFICATIONS: `${API_ROUTES.NOTIFICATIONS}`,
    DASHBOARD: `${API_ROUTES.DASHBOARD}`,
    FLOORS: `${API_ROUTES.FLOORS}`
};
