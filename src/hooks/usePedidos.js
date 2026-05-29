import { useCallback } from "react";
import { usePaginacion } from "./usePaginacion.js";
import { useFetch } from "./useFetch.js";
import { useAsync } from "./useAsync.js";
import {
    listarPedidos,
    obtenerPedido,
    crearPedido,
    actualizarEstadoPedido,
    cancelarPedido,
} from "../services/pedido.service.js";

export const usePedidos = (filtrosIniciales = {}) => {
    return usePaginacion(listarPedidos, filtrosIniciales);
};

export const usePedido = (id) => {
    return useFetch(() => obtenerPedido(id), [id], {
        ejecutarInmediatamente: !!id,
    });
};

export const useMutacionPedido = () => {
    const { cargando, error, ejecutar } = useAsync();

    const crear = useCallback(
        (payload) => ejecutar(crearPedido(payload)),
        [ejecutar],
    );

    const actualizarEstado = useCallback(
        (id, payload) => ejecutar(actualizarEstadoPedido(id, payload)),
        [ejecutar],
    );

    const cancelar = useCallback(
        (id) => ejecutar(cancelarPedido(id)),
        [ejecutar],
    );

    return { cargando, error, crear, actualizarEstado, cancelar };
};
