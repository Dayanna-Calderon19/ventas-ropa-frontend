import api from "./api.js";
import {
    guardarToken,
    guardarUsuario,
    limpiarSesion,
} from "../utils/almacenamiento.js";

export const iniciarSesion = async ({ correo, contrasena }) => {
    const { data } = await api.post("/auth/login", { correo, contrasena });
    guardarToken(data.data.token);
    guardarUsuario(data.data.usuario);
    return data.data;
};

export const registrarse = async ({ nombre, correo, contrasena, telefono }) => {
    const { data } = await api.post("/auth/registrar", {
        nombre,
        correo,
        contrasena,
        telefono,
    });
    guardarToken(data.data.token);
    guardarUsuario(data.data.usuario);
    return data.data;
};

export const cerrarSesion = () => {
    limpiarSesion();
};

export const obtenerPerfil = async () => {
    const { data } = await api.get("/auth/perfil");
    return data.data;
};

export const cambiarContrasena = async ({
    contrasenaActual,
    contrasenaNueva,
}) => {
    const { data } = await api.patch("/auth/cambiar-contrasena", {
        contrasenaActual,
        contrasenaNueva,
    });
    return data;
};
