export const extraerMensajeError = (error) => {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (error?.response?.data?.errors?.length) {
        return error.response.data.errors.map((e) => e.message).join(", ");
    }
    if (error?.message) {
        return error.message;
    }
    return "Ocurrió un error inesperado";
};

export const extraerErroresCampos = (error) => {
    if (error?.response?.data?.errors?.length) {
        return error.response.data.errors.reduce((acc, e) => {
            acc[e.field] = e.message;
            return acc;
        }, {});
    }
    return {};
};

export const esErrorAutenticacion = (error) => {
    return error?.response?.status === 401;
};

export const esErrorAutorizacion = (error) => {
    return error?.response?.status === 403;
};

export const esErrorValidacion = (error) => {
    return error?.response?.status === 400;
};

export const esErrorServidor = (error) => {
    return error?.response?.status >= 500;
};

export const esErrorRed = (error) => {
    return !error?.response && !!error?.request;
};
