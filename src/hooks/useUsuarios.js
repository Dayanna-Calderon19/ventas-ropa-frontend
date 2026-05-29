import { useCallback } from "react";
import { usePaginacion } from "./usePaginacion.js";
import { useFetch } from "./useFetch.js";
import { useAsync } from "./useAsync.js";
import {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarPerfil,
    obtenerHistorialPedidos,
    toggleActivoUsuario,
} from "../services/usuario.service.js";

export const useUsuarios = (filtrosIniciales = {}) => {
    return usePaginacion(listarUsuarios, filtrosIniciales);
};

export const useUsuario = (id) => {
    return useFetch(() => obtenerUsuario(id), [id], {
        ejecutarInmediatamente: !!id,
    });
};

export const useHistorialPedidos = (filtrosIniciales = {}) => {
    return usePaginacion(obtenerHistorialPedidos, filtrosIniciales);
};

export const useMutacionUsuario = () => {
    const { cargando, error, ejecutar } = useAsync();

    const crear = useCallback(
        (payload) => ejecutar(crearUsuario(payload)),
        [ejecutar],
    );

    const actualizarMiPerfil = useCallback(
        (payload) => ejecutar(actualizarPerfil(payload)),
        [ejecutar],
    );

    const toggleActivo = useCallback(
        (id) => ejecutar(toggleActivoUsuario(id)),
        [ejecutar],
    );

    return { cargando, error, crear, actualizarMiPerfil, toggleActivo };
};
