import api from "./api.js";

export const crearPedido = async (payload) => {
    const { data } = await api.post("/pedidos", payload);
    return data.data;
};

export const listarPedidos = async (filtros = {}) => {
    const { data } = await api.get("/pedidos", { params: filtros });
    return data.data;
};

export const obtenerPedido = async (id) => {
    const { data } = await api.get(`/pedidos/${id}`);
    return data.data;
};

export const actualizarEstadoPedido = async (id, payload) => {
    const { data } = await api.patch(`/pedidos/${id}/estado`, payload);
    return data.data;
};

export const cancelarPedido = async (id) => {
    const { data } = await api.patch(`/pedidos/${id}/cancelar`);
    return data.data;
};
