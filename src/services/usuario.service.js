import api from "./api.js";

export const listarUsuarios = async (filtros = {}) => {
    const { data } = await api.get("/usuarios", { params: filtros });
    return data.data;
};

export const obtenerUsuario = async (id) => {
    const { data } = await api.get(`/usuarios/${id}`);
    return data.data;
};

export const crearUsuario = async (payload) => {
    const { data } = await api.post("/usuarios", payload);
    return data.data;
};

export const actualizarPerfil = async (payload) => {
    const { data } = await api.patch("/usuarios/mi-perfil", payload);
    return data.data;
};

export const obtenerHistorialPedidos = async (filtros = {}) => {
    const { data } = await api.get("/usuarios/mi-perfil", { params: filtros });
    return data.data;
};

export const toggleActivoUsuario = async (id) => {
    const { data } = await api.patch(`/usuarios/${id}/toggle-activo`);
    return data.data;
};

export const listarUsuariosGestion = async (filtros = {}) => {
    const { data } = await api.get("/gestion-usuarios", { params: filtros });
    return data.data;
};

export const crearUsuarioGestion = async (payload) => {
    const { data } = await api.post("/gestion-usuarios", payload);
    return data.data;
};

export const actualizarUsuarioGestion = async (id, payload) => {
    const { data } = await api.put(`/gestion-usuarios/${id}`, payload);
    return data.data;
};

export const toggleActivoUsuarioGestion = async (id) => {
    const { data } = await api.patch(`/gestion-usuarios/${id}/toggle-activo`);
    return data.data;
};

export const crearCliente = async (payload) => {
    const { data } = await api.post(
        "/gestion-usuarios",
        payload
    );

    return data.data;
};