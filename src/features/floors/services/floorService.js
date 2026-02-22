import apiService from "../../../services/apiService";
import { FLOOR_URLS } from "./floorUrls";

export const floorService = {
    getAll: () => apiService.get(FLOOR_URLS.BASE),
    getById: (id) => apiService.get(FLOOR_URLS.BY_ID(id)),
    create: (formData) => apiService.post(FLOOR_URLS.BASE, formData),
    update: (id, formData) => apiService.put(FLOOR_URLS.BY_ID(id), formData),
    delete: (id) => apiService.delete(FLOOR_URLS.BY_ID(id)),
    updateHotspots: (id, hotspots) =>
        apiService.put(FLOOR_URLS.HOTSPOTS(id), { hotspots }),
};
