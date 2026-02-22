import apiService from "../../../services/apiService";
import { AUTH_URLS } from "./authUrls";

export const authService = {
    login: (data) => apiService.post(AUTH_URLS.LOGIN, data),
    register: (data) => apiService.post(AUTH_URLS.REGISTER, data),
    selectBranch: (data) => apiService.post(AUTH_URLS.SELECT_BRANCH, data),
    getMe: () => apiService.get(AUTH_URLS.GET_ME),
    updateProfile: (data) => apiService.put(AUTH_URLS.UPDATE_PROFILE, data),
    changePassword: (data) => apiService.put(AUTH_URLS.CHANGE_PASSWORD, data),
};
