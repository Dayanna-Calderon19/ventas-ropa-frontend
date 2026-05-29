import { useCallback } from "react";
import { usePaginacion } from "./usePaginacion.js";
import { useFetch } from "./useFetch.js";
import { useAsync } from "./useAsync.js";
import {
    listarVentas,
    obtenerVenta,
    registrarVenta,
} from "../services/venta.service.js";

export const useVentas = (filtrosIniciales = {}) => {
    return usePaginacion(listarVentas, filtrosIniciales);
};

export const useVenta = (id) => {
    return useFetch(() => obtenerVenta(id), [id], {
        ejecutarInmediatamente: !!id,
    });
};

export const useMutacionVenta = () => {
    const { cargando, error, ejecutar } = useAsync();

    const registrar = useCallback(
        (payload) => ejecutar(registrarVenta(payload)),
        [ejecutar],
    );

    return { cargando, error, registrar };
};
