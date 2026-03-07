import api from "../../../services/api";

export const branchService = {
    getBranches: async () => {
        const response = await api.get("/branches");
        return response.data;
    },

    getSingleBranch: async (id) => {
        const response = await api.get(`/branches/${id}`);
        return response.data;
    },

    createBranch: async (data) => {
        const response = await api.post("/branches", data);
        return response.data;
    },

    updateBranch: async (id, data) => {
        const response = await api.patch(`/branches/${id}`, data);
        return response.data;
    },

    deleteBranch: async (id) => {
        const response = await api.delete(`/branches/${id}`);
        return response.data;
    },
};
