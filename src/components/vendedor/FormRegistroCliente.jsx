import { useFormulario } from "../../hooks/useFormulario.js";
import { useMutacionUsuario } from "../../hooks/useUsuarios.js";
import { Input } from "../ui/Input.jsx";
import { Boton } from "../ui/Boton.jsx";
import { Alerta } from "../ui/Alerta.jsx";

const FormRegistroCliente = ({ onCerrar, onGuardado }) => {
    const {
        crear,
        cargando,
        error,
    } = useMutacionUsuario();

    const {
        valores,
        errores,
        manejarCambio,
        manejarEnvio,
    } = useFormulario(
        {
            nombre: "",
            correo: "",
            telefono: "",
            contrasena: "",
        },
        (v) => {
            const e = {};

            if (!v.nombre?.trim()) {
                e.nombre = "Ingrese el nombre";
            }

            if (
                !v.correo?.trim() ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.correo)
            ) {
                e.correo = "Correo inválido";
            }

            if (!v.contrasena || v.contrasena.length < 6) {
                e.contrasena =
                    "La contraseña debe tener mínimo 6 caracteres";
            }

            return e;
        }
    );

    const guardar = async (e) => {
        e.preventDefault();

        try {
            await manejarEnvio(async (datos) => {
                await crear(datos);

                onGuardado?.();
                onCerrar?.();
            });
        } catch (err) {
            // El hook ya maneja los errores
        }
    };

    return (
        <form
            onSubmit={guardar}
            className="flex flex-col gap-4"
        >
            {error && (
                <Alerta
                    tipo="error"
                    mensaje={error}
                />
            )}

            <Input
                label="Nombre"
                name="nombre"
                value={valores.nombre}
                onChange={manejarCambio}
                error={errores.nombre}
                requerido
            />

            <Input
                label="Correo"
                name="correo"
                type="email"
                value={valores.correo}
                onChange={manejarCambio}
                error={errores.correo}
                requerido
            />

            <Input
                label="Teléfono"
                name="telefono"
                value={valores.telefono}
                onChange={manejarCambio}
            />

            <Input
                label="Contraseña"
                name="contrasena"
                type="password"
                value={valores.contrasena}
                onChange={manejarCambio}
                error={errores.contrasena}
                requerido
            />

            <Boton
                type="submit"
                variante="primario"
                cargando={cargando}
                className="w-full"
            >
                Registrar cliente
            </Boton>
        </form>
    );
};

export default FormRegistroCliente;