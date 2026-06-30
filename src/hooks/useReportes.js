import { useCallback, useEffect, useState } from "react";
import { useFetch } from "./useFetch.js";
import { useAsync } from "./useAsync.js";
import {
    obtenerResumenGeneral,
    obtenerResumenDetallado,
    obtenerVentasPorPeriodo,
    obtenerProductosMasVendidos,
    obtenerIngresosMensuales,
    obtenerReporteInventario,
} from "../services/reporte.service.js";

export const useResumenGeneral = () => {
    return useFetch(obtenerResumenGeneral, [], { datosIniciales: null });
};

export const useResumenDetallado = () => {
    return useFetch(obtenerResumenDetallado, [], { datosIniciales: null });
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

export const useReportes = () => {
    const { datos: resumen, cargando: cargandoResumen } = useResumenDetallado();
    
    const { datos: inventario, cargando: cargandoInventario } =
        useReporteInventario();

    const { datos: ingresosMensuales, cargando: cargandoIngresos } =
        useIngresosMensuales();

    const { cargarProductosMasVendidos } = useReportesDinamicos();

    const [productosMasVendidos, setProductosMasVendidos] = useState([]);

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await cargarProductosMasVendidos({});
                setProductosMasVendidos(data || []);
            } catch (error) {
                console.error(error);
            }
        };

        cargar();
    }, [cargarProductosMasVendidos]);

    return {
        resumen,
        inventario,
        ingresosMensuales,
        productosMasVendidos,
        ventasPeriodo: [],
        cargando: cargandoResumen || cargandoInventario || cargandoIngresos,
    };
};
