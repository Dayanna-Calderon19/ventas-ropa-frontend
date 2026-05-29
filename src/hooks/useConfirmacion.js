import { useState, useCallback, useRef } from "react";

export const useConfirmacion = () => {
    const [abierto, setAbierto] = useState(false);
    const [configuracion, setConfiguracion] = useState({
        titulo: "Confirmar acción",
        mensaje: "",
        textoCancelar: "Cancelar",
        textoConfirmar: "Confirmar",
        variante: "peligro",
    });

    const resolverRef = useRef(null);

    const confirmar = useCallback((opciones = {}) => {
        setConfiguracion((prev) => ({ ...prev, ...opciones }));
        setAbierto(true);
        return new Promise((resolve) => {
            resolverRef.current = resolve;
        });
    }, []);

    const aceptar = useCallback(() => {
        setAbierto(false);
        resolverRef.current?.(true);
    }, []);

    const cancelar = useCallback(() => {
        setAbierto(false);
        resolverRef.current?.(false);
    }, []);

    return { abierto, configuracion, confirmar, aceptar, cancelar };
};
