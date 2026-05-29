import { useCallback } from "react";
import { usePaginacion } from "./usePaginacion.js";
import { useFetch } from "./useFetch.js";
import { useAsync } from "./useAsync.js";
import {
    listarVariantes,
    obtenerVariante,
    crearVariante,
    actualizarVariante,
    ajustarStock,
    listarMovimientos,
    obtenerProductosStockBajo,
} from "../services/inventario.service.js";

export const useVariantes = (filtrosIniciales = {}) => {
    return usePaginacion(listarVariantes, filtrosIniciales);
};

export const useVariante = (id) => {
    return useFetch(() => obtenerVariante(id), [id], {
        ejecutarInmediatamente: !!id,
    });
};

export const useMovimientos = (filtrosIniciales = {}) => {
    return usePaginacion(listarMovimientos, filtrosIniciales);
};

export const useStockBajo = () => {
    return useFetch(obtenerProductosStockBajo, [], { datosIniciales: [] });
};

export const useMutacionInventario = () => {
    const { cargando, error, ejecutar } = useAsync();

    const crearVarianteProducto = useCallback(
        (productoId, payload) => ejecutar(crearVariante(productoId, payload)),
        [ejecutar],
    );

    const actualizarVarianteProducto = useCallback(
        (id, payload) => ejecutar(actualizarVariante(id, payload)),
        [ejecutar],
    );

    const ajustar = useCallback(
        (id, payload) => ejecutar(ajustarStock(id, payload)),
        [ejecutar],
    );

    return {
        cargando,
        error,
        crearVarianteProducto,
        actualizarVarianteProducto,
        ajustar,
    };
};
