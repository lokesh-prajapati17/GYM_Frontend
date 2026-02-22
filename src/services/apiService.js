import api from "./api";

/**
 * Centralized API Service with built-in security.
 *
 * - Token is auto-attached via the axios interceptor in api.js.
 * - Content-Type is auto-detected (FormData = multipart, otherwise JSON).
 * - Callers only need to pass: (url) or (url, data) or (url, { params }).
 */

const getHeaders = (data) => {
    if (data instanceof FormData) {
        return { "Content-Type": "multipart/form-data" };
    }
    return { "Content-Type": "application/json" };
};

const apiService = {
    get: (url, params = {}) => {
        return api.get(url, { params });
    },

    post: (url, data = {}) => {
        return api.post(url, data, { headers: getHeaders(data) });
    },

    put: (url, data = {}) => {
        return api.put(url, data, { headers: getHeaders(data) });
    },

    patch: (url, data = {}) => {
        return api.patch(url, data, { headers: getHeaders(data) });
    },

    delete: (url, params = {}) => {
        return api.delete(url, { params });
    },
};

export default apiService;
