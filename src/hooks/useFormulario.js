import { useState, useCallback } from "react";
import { hayErrores } from "../utils/validaciones.js";
import {
    extraerErroresCampos,
    extraerMensajeError,
} from "../utils/manejarError.js";

export const useFormulario = (valoresIniciales = {}, funcionValidar = null) => {
    const [valores, setValores] = useState(valoresIniciales);
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const [errorGlobal, setErrorGlobal] = useState(null);

    const manejarCambio = useCallback(
        (e) => {
            const { name, value, type, checked } = e.target;
            const nuevoValor = type === "checkbox" ? checked : value;

            setValores((prev) => ({ ...prev, [name]: nuevoValor }));

            if (errores[name]) {
                setErrores((prev) => {
                    const copia = { ...prev };
                    delete copia[name];
                    return copia;
                });
            }
        },
        [errores],
    );

    const establecerValor = useCallback(
        (nombre, valor) => {
            setValores((prev) => ({ ...prev, [nombre]: valor }));
            if (errores[nombre]) {
                setErrores((prev) => {
                    const copia = { ...prev };
                    delete copia[nombre];
                    return copia;
                });
            }
        },
        [errores],
    );

    const establecerValores = useCallback((nuevosValores) => {
        setValores((prev) => ({ ...prev, ...nuevosValores }));
    }, []);

    const validar = useCallback(() => {
        if (!funcionValidar) return true;
        const erroresEncontrados = funcionValidar(valores);
        setErrores(erroresEncontrados);
        return !hayErrores(erroresEncontrados);
    }, [funcionValidar, valores]);

    const manejarEnvio = useCallback(
        async (funcionSubmit) => {
            setErrorGlobal(null);

            if (!validar()) return;

            setEnviando(true);
            try {
                await funcionSubmit(valores);
            } catch (err) {
                const erroresCampos = extraerErroresCampos(err);
                if (hayErrores(erroresCampos)) {
                    setErrores(erroresCampos);
                } else {
                    setErrorGlobal(extraerMensajeError(err));
                }
                throw err;
            } finally {
                setEnviando(false);
            }
        },
        [validar, valores],
    );

    const resetear = useCallback(() => {
        setValores(valoresIniciales);
        setErrores({});
        setErrorGlobal(null);
        setEnviando(false);
    }, [valoresIniciales]);

    const resetearCampo = useCallback(
        (nombre) => {
            setValores((prev) => ({
                ...prev,
                [nombre]: valoresIniciales[nombre] ?? "",
            }));
            setErrores((prev) => {
                const copia = { ...prev };
                delete copia[nombre];
                return copia;
            });
        },
        [valoresIniciales],
    );

    return {
        valores,
        errores,
        enviando,
        errorGlobal,
        manejarCambio,
        establecerValor,
        establecerValores,
        manejarEnvio,
        resetear,
        resetearCampo,
        setErrores,
        setErrorGlobal,
    };
};
