import { useState, useCallback, useRef } from "react";

const DURACION_DEFAULT = 4000;

export const useNotificacion = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const contadorRef = useRef(0);

    const agregar = useCallback(
        (mensaje, tipo = "info", duracion = DURACION_DEFAULT) => {
            const id = ++contadorRef.current;

            setNotificaciones((prev) => [...prev, { id, mensaje, tipo }]);

            if (duracion > 0) {
                setTimeout(() => {
                    setNotificaciones((prev) =>
                        prev.filter((n) => n.id !== id),
                    );
                }, duracion);
            }

            return id;
        },
        [],
    );

    const exito = useCallback(
        (mensaje, duracion) => agregar(mensaje, "exito", duracion),
        [agregar],
    );

    const error = useCallback(
        (mensaje, duracion) => agregar(mensaje, "error", duracion),
        [agregar],
    );

    const advertencia = useCallback(
        (mensaje, duracion) => agregar(mensaje, "advertencia", duracion),
        [agregar],
    );

    const info = useCallback(
        (mensaje, duracion) => agregar(mensaje, "info", duracion),
        [agregar],
    );

    const eliminar = useCallback((id) => {
        setNotificaciones((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const limpiarTodas = useCallback(() => {
        setNotificaciones([]);
    }, []);

    return {
        notificaciones,
        exito,
        error,
        advertencia,
        info,
        eliminar,
        limpiarTodas,
    };
};
