const CLAVE_TOKEN = "tienda_token";
const CLAVE_USUARIO = "tienda_usuario";

export const guardarToken = (token) => {
    localStorage.setItem(CLAVE_TOKEN, token);
};

export const obtenerToken = () => {
    return localStorage.getItem(CLAVE_TOKEN);
};

export const eliminarToken = () => {
    localStorage.removeItem(CLAVE_TOKEN);
};

export const guardarUsuario = (usuario) => {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
};

export const obtenerUsuario = () => {
    try {
        const datos = localStorage.getItem(CLAVE_USUARIO);
        return datos ? JSON.parse(datos) : null;
    } catch {
        return null;
    }
};

export const eliminarUsuario = () => {
    localStorage.removeItem(CLAVE_USUARIO);
};

export const limpiarSesion = () => {
    eliminarToken();
    eliminarUsuario();
};

export const haySesionActiva = () => {
    return !!obtenerToken() && !!obtenerUsuario();
};
