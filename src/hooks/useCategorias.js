import { useCallback } from "react";
import { usePaginacion } from "./usePaginacion.js";
import { useFetch } from "./useFetch.js";
import { useAsync } from "./useAsync.js";
import {
    listarCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
} from "../services/categoria.service.js";

export const useCategoriasPaginadas = (filtrosIniciales = {}) => {
    return usePaginacion(listarCategorias, filtrosIniciales);
};

export const useCategoria = (id) => {
    return useFetch(() => obtenerCategoria(id), [id], {
        ejecutarInmediatamente: !!id,
    });
};

export const useMutacionCategoria = () => {
    const { cargando, error, ejecutar } = useAsync();

    const crear = useCallback(
        (payload) => ejecutar(crearCategoria(payload)),
        [ejecutar],
    );
    const actualizar = useCallback(
        (id, payload) => ejecutar(actualizarCategoria(id, payload)),
        [ejecutar],
    );
    const eliminar = useCallback(
        (id) => ejecutar(eliminarCategoria(id)),
        [ejecutar],
    );

    return { cargando, error, crear, actualizar, eliminar };
};
