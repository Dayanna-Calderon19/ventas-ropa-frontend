import api from "./api.js";

export const registrarse = async (payload) => {
    const { data } = await api.post("/auth/registrar", payload);
    return data;
};

export const iniciarSesion = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    return data;
};

export const obtenerPerfil = async () => {
    const { data } = await api.get("/auth/perfil");
    return data.data;
};

export const actualizarPerfil = async (payload) => {
    const { data } = await api.patch("/auth/mi-perfil", payload);
    return data.data;
};

export const cambiarContrasena = async (payload) => {
    const { data } = await api.patch("/auth/cambiar-contrasena", payload);
    return data;
};
