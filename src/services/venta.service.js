import api from "./api.js";

export const registrarVenta = async (payload) => {
    const { data } = await api.post("/ventas", payload);
    return data.data;
};

export const listarVentas = async (filtros = {}) => {
    const { data } = await api.get("/ventas", { params: filtros });
    return data.data;
};

export const obtenerVenta = async (id) => {
    const { data } = await api.get(`/ventas/${id}`);
    return data.data;
};
