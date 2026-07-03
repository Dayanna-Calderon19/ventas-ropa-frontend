import api from "./api.js";

export const listarPromociones = async (filtros = {}) => {
    const { data } = await api.get("/promociones", { params: filtros });
    return data.data;
};

export const obtenerPromocion = async (id) => {
    const { data } = await api.get(`/promociones/${id}`);
    return data.data;
};

export const crearPromocion = async (payload) => {
    const { data } = await api.post("/promociones", payload);
    return data.data;
};

export const actualizarPromocion = async (id, payload) => {
    const { data } = await api.put(`/promociones/${id}`, payload);
    return data.data;
};

export const eliminarPromocion = async (id) => {
    const { data } = await api.delete(`/promociones/${id}`);
    return data;
};
