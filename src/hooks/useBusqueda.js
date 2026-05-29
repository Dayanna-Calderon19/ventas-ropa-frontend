import { useState, useCallback } from "react";
import { useDebounce } from "./useDebounce.js";

export const useBusqueda = (retraso = 400) => {
    const [termino, setTermino] = useState("");
    const terminoRetrasado = useDebounce(termino, retraso);

    const manejarCambio = useCallback((e) => {
        setTermino(e.target.value);
    }, []);

    const limpiar = useCallback(() => {
        setTermino("");
    }, []);

    return {
        termino,
        terminoRetrasado,
        manejarCambio,
        limpiar,
        hayTermino: termino.trim().length > 0,
    };
};
