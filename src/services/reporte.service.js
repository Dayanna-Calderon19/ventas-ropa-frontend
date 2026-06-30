import api from "./api.js";

export const obtenerResumenGeneral = async () => {
    const { data } = await api.get("/reportes/resumen");
    return data.data;
};

export const obtenerResumenDetallado = async () => {
    const { data } = await api.get("/reportes/resumen-detallado");
    return data.data;
};

export const obtenerVentasPorPeriodo = async (filtros = {}) => {
    const { data } = await api.get("/reportes/ventas", { params: filtros });
    return data.data;
};

export const obtenerProductosMasVendidos = async (filtros = {}) => {
    const { data } = await api.get("/reportes/productos-mas-vendidos", {
        params: filtros,
    });
    return data.data;
};

export const obtenerIngresosMensuales = async (anio) => {
    const { data } = await api.get("/reportes/ingresos-mensuales", {
        params: { año: anio },
    });
    return data.data;
};

export const obtenerReporteInventario = async () => {
    const { data } = await api.get("/reportes/inventario");
    return data.data;
};
