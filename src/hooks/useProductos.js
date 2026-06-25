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
    toggleActivoProducto,
    crearVariante,
    actualizarVariante,
    toggleActivoVariante,
} from "../services/producto.service.js";
import { listarCategorias } from "../services/categoria.service.js";

export const useProductos = (filtrosIniciales = {}) => {
    return usePaginacion(listarProductos, filtrosIniciales);
};

export const useProducto = (id) => {
    return useFetch(() => obtenerProducto(id), [id], {
        ejecutarInmediatamente: !!id,
    });
};

export const useCategorias = () => {
    return useFetch(async () => {
        const resultado = await listarCategorias();
        return resultado.data;
    }, [], { datosIniciales: [] });
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

    const toggleActivo = useCallback(
        (id) => ejecutar(toggleActivoProducto(id)),
        [ejecutar],
    );

    const crearVar = useCallback(
        (pId, payload) => ejecutar(crearVariante(pId, payload)),
        [ejecutar],
    );

    const actualizarVar = useCallback(
        (id, payload) => ejecutar(actualizarVariante(id, payload)),
        [ejecutar],
    );

    const toggleActivoVar = useCallback(
        (id) => ejecutar(toggleActivoVariante(id)),
        [ejecutar],
    );

    return {
        cargando,
        error,
        crear,
        actualizar,
        eliminar,
        toggleActivo,
        crearVar,
        actualizarVar,
        toggleActivoVar,
    };
};