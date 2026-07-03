import api from "./api.js";

export const listarClientes = async (filtros = {}) => {
    const { data } = await api.get("/usuarios", {
        params: { ...filtros, rol: "CLIENTE" },
    });
    return data.data;
};

export const obtenerCliente = async (id) => {
    const { data } = await api.get(`/usuarios/${id}`);
    return data.data;
};

export const crearCliente = async ({
    nombre,
    correo,
    contrasena,
    telefono,
}) => {
    const { data } = await api.post("/usuarios", {
        nombre,
        correo,
        contrasena,
        telefono,
        rol: "CLIENTE",
    });
    return data.data;
};
