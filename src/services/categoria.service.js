import api from "./api.js";

export const listarCategorias = async (filtros = {}) => {
    const { data } = await api.get("/categorias", { params: filtros });
    return data.data;
};

export const obtenerCategoria = async (id) => {
    const { data } = await api.get(`/categorias/${id}`);
    return data.data;
};

export const crearCategoria = async (payload) => {
    const { data } = await api.post("/categorias", payload);
    return data.data;
};

export const actualizarCategoria = async (id, payload) => {
    const { data } = await api.put(`/categorias/${id}`, payload);
    return data.data;
};

export const eliminarCategoria = async (id) => {
    const { data } = await api.delete(`/categorias/${id}`);
    return data;
};
