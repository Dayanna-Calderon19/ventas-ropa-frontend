import { useCallback } from "react";
import { usePaginacion } from "./usePaginacion.js";
import { useFetch } from "./useFetch.js";
import { useAsync } from "./useAsync.js";
import {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    crearCliente,
    actualizarPerfil,
    obtenerHistorialPedidos,
    toggleActivoUsuario,
    listarUsuariosGestion,
    crearUsuarioGestion,
    actualizarUsuarioGestion,
    toggleActivoUsuarioGestion,
} from "../services/usuario.service.js";

export const useUsuarios = (filtrosIniciales = {}) => {
    return usePaginacion(listarUsuarios, filtrosIniciales);
};

export const useUsuariosGestion = (filtrosIniciales = {}) => {
    return usePaginacion(listarUsuariosGestion, filtrosIniciales);
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

    const crearClienteVendedor = useCallback(
    (payload) => ejecutar(crearCliente(payload)),
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

    const crearGestion = useCallback(
        (payload) => ejecutar(crearUsuarioGestion(payload)),
        [ejecutar],
    );

    const actualizarGestion = useCallback(
        (id, payload) => ejecutar(actualizarUsuarioGestion(id, payload)),
        [ejecutar],
    );

    const toggleActivoGestion = useCallback(
        (id) => ejecutar(toggleActivoUsuarioGestion(id)),
        [ejecutar],
    );

    return {
        cargando,
        error,
        crear,
        crearClienteVendedor,
        actualizarMiPerfil,
        toggleActivo,
        crearGestion,
        actualizarGestion,
        toggleActivoGestion,
    };
};

