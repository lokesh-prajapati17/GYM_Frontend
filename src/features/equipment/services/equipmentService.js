import api from "../../../services/api";

export const equipmentService = {
    getEquipment: async () => {
        const response = await api.get("/equipment");
        return response.data;
    },

    getSingleEquipment: async (id) => {
        const response = await api.get(`/equipment/${id}`);
        return response.data;
    },

    addEquipment: async (data) => {
        const response = await api.post("/equipment", data);
        return response.data;
    },

    updateEquipment: async (id, data) => {
        const response = await api.put(`/equipment/${id}`, data);
        return response.data;
    },

    deleteEquipment: async (id) => {
        const response = await api.delete(`/equipment/${id}`);
        return response.data;
    },
};
