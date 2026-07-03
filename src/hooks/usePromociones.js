import { useCallback } from "react";
import { usePaginacion } from "./usePaginacion.js";
import { useFetch } from "./useFetch.js";
import { useAsync } from "./useAsync.js";
import {
    listarPromociones,
    obtenerPromocion,
    crearPromocion,
    actualizarPromocion,
    eliminarPromocion,
} from "../services/promocion.service.js";

export const usePromociones = (filtrosIniciales = {}) => {
    return usePaginacion(listarPromociones, filtrosIniciales);
};

export const usePromocion = (id) => {
    return useFetch(() => obtenerPromocion(id), [id], {
        ejecutarInmediatamente: !!id,
    });
};

export const useMutacionPromocion = () => {
    const { cargando, error, ejecutar } = useAsync();

    const crear = useCallback(
        (payload) => ejecutar(crearPromocion(payload)),
        [ejecutar],
    );
    const actualizar = useCallback(
        (id, payload) => ejecutar(actualizarPromocion(id, payload)),
        [ejecutar],
    );
    const eliminar = useCallback(
        (id) => ejecutar(eliminarPromocion(id)),
        [ejecutar],
    );

    return { cargando, error, crear, actualizar, eliminar };
};
