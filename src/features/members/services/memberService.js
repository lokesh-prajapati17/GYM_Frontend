import apiService from "../../../services/apiService";
import { MEMBER_URLS } from "./memberUrls";

export const memberService = {
    getAll: (params) => apiService.get(MEMBER_URLS.BASE, params),
    getById: (id) => apiService.get(MEMBER_URLS.BY_ID(id)),
    create: (data) => apiService.post(MEMBER_URLS.BASE, data),
    update: (id, data) => apiService.put(MEMBER_URLS.BY_ID(id), data),
    delete: (id) => apiService.delete(MEMBER_URLS.BY_ID(id)),
};
