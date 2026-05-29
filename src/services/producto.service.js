import api from "./api.js";

export const listarProductos = async (filtros = {}) => {
    const { data } = await api.get("/productos", { params: filtros });
    return data.data;
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

export const eliminarProducto = async (id) => {
    const { data } = await api.delete(`/productos/${id}`);
    return data;
};

export const listarCategorias = async () => {
    const { data } = await api.get("/productos/categorias");
    return data.data;
};

export const crearCategoria = async (payload) => {
    const { data } = await api.post("/productos/categorias", payload);
    return data.data;
};
