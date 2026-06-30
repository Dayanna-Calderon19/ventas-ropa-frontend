import { useState, useCallback } from "react";

export const useModal = (clavePersistencia = null, abiertoPorDefecto = false) => {
    // Si se pasa un boolean como primer argumento (retrocompatibilidad)
    let key = clavePersistencia;
    let defOpen = abiertoPorDefecto;
    if (typeof clavePersistencia === 'boolean') {
        key = null;
        defOpen = clavePersistencia;
    }

    const [abierto, setAbierto] = useState(() => {
        if (key) {
            const guardado = localStorage.getItem(`modal_abierto_${key}`);
            return guardado !== null ? JSON.parse(guardado) : defOpen;
        }
        return defOpen;
    });

    const [datos, setDatos] = useState(() => {
        if (key) {
            const guardados = localStorage.getItem(`modal_datos_${key}`);
            try {
                return guardados ? JSON.parse(guardados) : null;
            } catch (e) {
                console.error("Error parsing persisted modal data:", e);
                return null;
            }
        }
        return null;
    });

    const abrir = useCallback((datosPasados = null) => {
        setDatos(datosPasados);
        setAbierto(true);
        if (key) {
            localStorage.setItem(`modal_abierto_${key}`, JSON.stringify(true));
            if (datosPasados !== null && datosPasados !== undefined) {
                localStorage.setItem(`modal_datos_${key}`, JSON.stringify(datosPasados));
            } else {
                localStorage.removeItem(`modal_datos_${key}`);
            }
        }
    }, [key]);

    const cerrar = useCallback(() => {
        setAbierto(false);
        setDatos(null);
        if (key) {
            localStorage.removeItem(`modal_abierto_${key}`);
            localStorage.removeItem(`modal_datos_${key}`);
        }
    }, [key]);

    const alternar = useCallback(() => {
        setAbierto((prev) => {
            const nuevoEstado = !prev;
            if (key) {
                localStorage.setItem(`modal_abierto_${key}`, JSON.stringify(nuevoEstado));
                if (!nuevoEstado) {
                    localStorage.removeItem(`modal_datos_${key}`);
                }
            }
            return nuevoEstado;
        });
    }, [key]);

    return { abierto, datos, abrir, cerrar, alternar };
};
