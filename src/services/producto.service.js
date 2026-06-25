import api from "./api.js";

export const listarProductos = async (filtros = {}) => {
    const { data } = await api.get("/productos", { params: filtros });
    return data.data.data;
};

export const obtenerProducto = async (id) => {
    const { data } = await api.get(`/productos/${id}`);
    return data.data;
};

export const crearProducto = async (payload) => {
    const { data } = await api.post("/productos", payload);
    return data.data;
};

export const actualizarProducto = async (id, payload) => {
    const { data } = await api.put(`/productos/${id}`, payload);
    return data.data;
};

export const toggleActivoProducto = async (id) => {
    const { data } = await api.patch(`/productos/${id}/toggle-activo`);
    return data.data;
};

export const eliminarProducto = async (id) => {
    return toggleActivoProducto(id);
};

// Variantes
export const crearVariante = async (productoId, payload) => {
    const { data } = await api.post(`/productos/${productoId}/variantes`, payload);
    return data.data;
};

export const actualizarVariante = async (id, payload) => {
    const { data } = await api.put(`/productos/variantes/${id}`, payload);
    return data.data;
};

export const toggleActivoVariante = async (id) => {
    const { data } = await api.patch(`/productos/variantes/${id}/toggle-activo`);
    return data.data;
};


