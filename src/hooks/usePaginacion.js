import { useState, useCallback, useEffect } from "react";
import { extraerMensajeError } from "../utils/manejarError.js";
import { PAGINACION_LIMITE_DEFAULT } from "../utils/constantes.js";

export const usePaginacion = (
    funcionListar,
    filtrosIniciales = {},
    opciones = {},
) => {
    const { limite = PAGINACION_LIMITE_DEFAULT } = opciones;

    const [datos, setDatos] = useState([]);
    const [meta, setMeta] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [filtros, setFiltros] = useState(filtrosIniciales);

    const cargar = useCallback(
        async (paginaActual = pagina, filtrosActuales = filtros) => {
            setCargando(true);
            setError(null);
            try {
                const resultado = await funcionListar({
                    ...filtrosActuales,
                    page: paginaActual,
                    limit: limite,
                });
                setDatos(resultado.data);
                setMeta(resultado.meta);
            } catch (err) {
                setError(extraerMensajeError(err));
            } finally {
                setCargando(false);
            }
        },
        [funcionListar, pagina, filtros, limite],
    );

    useEffect(() => {
        cargar(pagina, filtros);
    }, [pagina, filtros]);

    const irAPagina = useCallback((nuevaPagina) => {
        setPagina(nuevaPagina);
    }, []);

    const paginaSiguiente = useCallback(() => {
        if (meta?.hasNextPage) setPagina((p) => p + 1);
    }, [meta]);

    const paginaAnterior = useCallback(() => {
        if (meta?.hasPrevPage) setPagina((p) => p - 1);
    }, [meta]);

    const aplicarFiltros = useCallback((nuevosFiltros) => {
        setPagina(1);
        setFiltros((prev) => ({ ...prev, ...nuevosFiltros }));
    }, []);

    const limpiarFiltros = useCallback(() => {
        setPagina(1);
        setFiltros(filtrosIniciales);
    }, [filtrosIniciales]);

    const recargar = useCallback(() => {
        cargar(pagina, filtros);
    }, [cargar, pagina, filtros]);

    return {
        datos,
        meta,
        cargando,
        error,
        pagina,
        filtros,
        irAPagina,
        paginaSiguiente,
        paginaAnterior,
        aplicarFiltros,
        limpiarFiltros,
        recargar,
    };
};
