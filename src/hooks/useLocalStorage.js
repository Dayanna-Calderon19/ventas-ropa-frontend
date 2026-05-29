import { useState, useCallback } from "react";

export const useLocalStorage = (clave, valorInicial) => {
    const [valorAlmacenado, setValorAlmacenado] = useState(() => {
        try {
            const item = window.localStorage.getItem(clave);
            return item ? JSON.parse(item) : valorInicial;
        } catch {
            return valorInicial;
        }
    });

    const guardar = useCallback(
        (valor) => {
            try {
                const valorAGuardar =
                    valor instanceof Function ? valor(valorAlmacenado) : valor;
                setValorAlmacenado(valorAGuardar);
                window.localStorage.setItem(
                    clave,
                    JSON.stringify(valorAGuardar),
                );
            } catch (err) {
                console.error(
                    `Error al guardar en localStorage [${clave}]:`,
                    err,
                );
            }
        },
        [clave, valorAlmacenado],
    );

    const eliminar = useCallback(() => {
        try {
            window.localStorage.removeItem(clave);
            setValorAlmacenado(valorInicial);
        } catch (err) {
            console.error(`Error al eliminar de localStorage [${clave}]:`, err);
        }
    }, [clave, valorInicial]);

    return [valorAlmacenado, guardar, eliminar];
};
