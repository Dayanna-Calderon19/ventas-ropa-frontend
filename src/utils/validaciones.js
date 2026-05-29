export const esCorreoValido = (correo) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
};

export const esContrasenaValida = (contrasena) => {
    return (
        contrasena.length >= 8 &&
        /[A-Z]/.test(contrasena) &&
        /[0-9]/.test(contrasena)
    );
};

export const esTelefonoValido = (telefono) => {
    return /^\+?[\d\s\-()]{7,15}$/.test(telefono);
};

export const esUUID = (valor) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        valor,
    );
};

export const esPrecioValido = (valor) => {
    return !isNaN(valor) && parseFloat(valor) >= 0;
};

export const esStockValido = (valor) => {
    return Number.isInteger(Number(valor)) && Number(valor) >= 0;
};

export const validarFormularioLogin = ({ correo, contrasena }) => {
    const errores = {};
    if (!correo) errores.correo = "El correo es requerido";
    else if (!esCorreoValido(correo)) errores.correo = "El correo no es válido";
    if (!contrasena) errores.contrasena = "La contraseña es requerida";
    return errores;
};

export const validarFormularioRegistro = ({
    nombre,
    correo,
    contrasena,
    telefono,
}) => {
    const errores = {};
    if (!nombre || nombre.trim().length < 2)
        errores.nombre = "El nombre debe tener al menos 2 caracteres";
    if (!correo) errores.correo = "El correo es requerido";
    else if (!esCorreoValido(correo)) errores.correo = "El correo no es válido";
    if (!contrasena) errores.contrasena = "La contraseña es requerida";
    else if (!esContrasenaValida(contrasena)) {
        errores.contrasena = "Mínimo 8 caracteres, una mayúscula y un número";
    }
    if (telefono && !esTelefonoValido(telefono))
        errores.telefono = "El teléfono no es válido";
    return errores;
};

export const validarFormularioProducto = ({
    nombre,
    precioBase,
    categoriaId,
}) => {
    const errores = {};
    if (!nombre || nombre.trim().length < 2)
        errores.nombre = "El nombre debe tener al menos 2 caracteres";
    if (!precioBase && precioBase !== 0)
        errores.precioBase = "El precio es requerido";
    else if (!esPrecioValido(precioBase))
        errores.precioBase = "El precio debe ser un número positivo";
    if (!categoriaId) errores.categoriaId = "La categoría es requerida";
    return errores;
};

export const hayErrores = (errores) => Object.keys(errores).length > 0;
