import api from "./api.js";

export const listarVariantes = async (filtros = {}) => {
    const { data } = await api.get("/inventario", { params: filtros });
    return data.data;
};

export const obtenerVariante = async (id) => {
    const { data } = await api.get(`/inventario/${id}`);
    return data.data;
};

export const crearVariante = async (productoId, payload) => {
    const { data } = await api.post(
        `/inventario/producto/${productoId}`,
        payload,
    );
    return data.data;
};

export const actualizarVariante = async (id, payload) => {
    const { data } = await api.patch(`/inventario/${id}`, payload);
    return data.data;
};

export const ajustarStock = async (id, payload) => {
    const { data } = await api.post(`/inventario/${id}/ajuste`, payload);
    return data.data;
};

export const listarMovimientos = async (filtros = {}) => {
    const { data } = await api.get("/inventario/movimientos", {
        params: filtros,
    });
    return data.data;
};

export const obtenerProductosStockBajo = async () => {
    const { data } = await api.get("/inventario/stock-bajo");
    return data.data;
};
