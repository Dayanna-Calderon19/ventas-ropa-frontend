import { useState, useEffect, useCallback, useRef } from "react";
import { extraerMensajeError } from "../utils/manejarError.js";

export const useFetch = (funcionFetch, dependencias = [], opciones = {}) => {
    const { ejecutarInmediatamente = true, datosIniciales = null } = opciones;

    const [datos, setDatos] = useState(datosIniciales);
    const [cargando, setCargando] = useState(ejecutarInmediatamente);
    const [error, setError] = useState(null);
    const canceladoRef = useRef(false);

    const cargar = useCallback(async (...args) => {
        canceladoRef.current = false;
        setCargando(true);
        setError(null);
        try {
            const resultado = await funcionFetch(...args);
            if (!canceladoRef.current) {
                setDatos(resultado);
            }
            return resultado;
        } catch (err) {
            if (!canceladoRef.current) {
                setError(extraerMensajeError(err));
            }
            throw err;
        } finally {
            if (!canceladoRef.current) {
                setCargando(false);
            }
        }
    }, dependencias);

    useEffect(() => {
        if (!ejecutarInmediatamente) return;
        cargar();
        return () => {
            canceladoRef.current = true;
        };
    }, [cargar]);

    const limpiar = useCallback(() => {
        setDatos(datosIniciales);
        setError(null);
        setCargando(false);
    }, []);

    return { datos, cargando, error, cargar, limpiar, setDatos };
};
