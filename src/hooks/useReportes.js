import { useCallback } from "react";
import { useFetch } from "./useFetch.js";
import { useAsync } from "./useAsync.js";
import {
    obtenerResumenGeneral,
    obtenerVentasPorPeriodo,
    obtenerProductosMasVendidos,
    obtenerIngresosMensuales,
    obtenerReporteInventario,
} from "../services/reporte.service.js";

export const useResumenGeneral = () => {
    return useFetch(obtenerResumenGeneral, [], { datosIniciales: null });
};

export const useReporteInventario = () => {
    return useFetch(obtenerReporteInventario, [], { datosIniciales: null });
};

export const useIngresosMensuales = (año = new Date().getFullYear()) => {
    return useFetch(() => obtenerIngresosMensuales(año), [año], {
        datosIniciales: [],
    });
};

export const useReportesDinamicos = () => {
    const { cargando, error, ejecutar } = useAsync();

    const cargarVentasPorPeriodo = useCallback(
        (filtros) => ejecutar(obtenerVentasPorPeriodo(filtros)),
        [ejecutar],
    );

    const cargarProductosMasVendidos = useCallback(
        (filtros) => ejecutar(obtenerProductosMasVendidos(filtros)),
        [ejecutar],
    );

    return {
        cargando,
        error,
        cargarVentasPorPeriodo,
        cargarProductosMasVendidos,
    };
};
