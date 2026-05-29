import { useState, useCallback } from "react";
import { extraerMensajeError } from "../utils/manejarError.js";

export const useAsync = () => {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const ejecutar = useCallback(async (promesa) => {
        setCargando(true);
        setError(null);
        try {
            const resultado = await promesa;
            return resultado;
        } catch (err) {
            const mensaje = extraerMensajeError(err);
            setError(mensaje);
            throw err;
        } finally {
            setCargando(false);
        }
    }, []);

    const limpiarError = useCallback(() => setError(null), []);

    return { cargando, error, ejecutar, limpiarError };
};
