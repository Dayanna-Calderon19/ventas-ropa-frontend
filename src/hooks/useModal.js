import { useState, useCallback } from "react";

export const useModal = (abiertoPorDefecto = false) => {
    const [abierto, setAbierto] = useState(abiertoPorDefecto);
    const [datos, setDatos] = useState(null);

    const abrir = useCallback((datosPasados = null) => {
        setDatos(datosPasados);
        setAbierto(true);
    }, []);

    const cerrar = useCallback(() => {
        setAbierto(false);
        setDatos(null);
    }, []);

    const alternar = useCallback(() => {
        setAbierto((prev) => !prev);
    }, []);

    return { abierto, datos, abrir, cerrar, alternar };
};
