import { useCallback } from "react";
import { usePaginacion } from "./usePaginacion.js";
import { useFetch } from "./useFetch.js";
import { useAsync } from "./useAsync.js";
import {
    listarProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    listarCategorias,
} from "../services/producto.service.js";

export const useProductos = (filtrosIniciales = {}) => {
    return usePaginacion(listarProductos, filtrosIniciales);
};

export const useProducto = (id) => {
    return useFetch(() => obtenerProducto(id), [id], {
        ejecutarInmediatamente: !!id,
    });
};

export const useCategorias = () => {
    return useFetch(listarCategorias, [], { datosIniciales: [] });
};

export const useMutacionProducto = () => {
    const { cargando, error, ejecutar } = useAsync();

    const crear = useCallback(
        (payload) => ejecutar(crearProducto(payload)),
        [ejecutar],
    );
    const actualizar = useCallback(
        (id, payload) => ejecutar(actualizarProducto(id, payload)),
        [ejecutar],
    );
    const eliminar = useCallback(
        (id) => ejecutar(eliminarProducto(id)),
        [ejecutar],
    );

    return { cargando, error, crear, actualizar, eliminar };
};
