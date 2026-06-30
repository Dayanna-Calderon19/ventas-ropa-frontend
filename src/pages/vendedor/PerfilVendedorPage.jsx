import { useEffect } from 'react'
import { RiUserLine, RiLockLine } from 'react-icons/ri'
import { useAuth } from '../../hooks/useAuth.js'
import { useMutacionUsuario } from '../../hooks/useUsuarios.js'
import { useFormulario } from '../../hooks/useFormulario.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Alerta } from '../../components/ui/Alerta.jsx'
import { authService } from '../../services/index.js'

const validarPerfil = ({ nombre }) => {
    const errores = {}
    if (!nombre?.trim() || nombre.trim().length < 2)
        errores.nombre = 'El nombre debe tener al menos 2 caracteres'
    return errores
}

const validarContrasena = ({ contrasenaActual, contrasenaNueva }) => {
    const errores = {}
    if (!contrasenaActual) errores.contrasenaActual = 'La contraseña actual es requerida'
    if (!contrasenaNueva) errores.contrasenaNueva = 'La contraseña nueva es requerida'
    else if (contrasenaNueva.length < 8) errores.contrasenaNueva = 'Mínimo 8 caracteres'
    else if (!/[A-Z]/.test(contrasenaNueva)) errores.contrasenaNueva = 'Debe incluir una mayúscula'
    else if (!/[0-9]/.test(contrasenaNueva)) errores.contrasenaNueva = 'Debe incluir un número'
    return errores
}

const SeccionPerfil = ({ usuario, onActualizar }) => {
    const { actualizarMiPerfil, cargando } = useMutacionUsuario()
    const { exito } = useToast()

    const { valores, errores, errorGlobal, manejarCambio, establecerValores, manejarEnvio } =
        useFormulario(
            {
                nombre: '',
                telefono: '',
            },
            validarPerfil
        )

    useEffect(() => {
        if (usuario) {
            establecerValores({
                nombre: usuario.nombre || '',
                telefono: usuario.telefono || '',
            })
        }
    }, [usuario])

    const manejarSubmit = async (e) => {
        e.preventDefault()
        await manejarEnvio(async (datos) => {
            const actualizado = await actualizarMiPerfil({
                nombre: datos.nombre,
                telefono: datos.telefono || undefined,
            })
            onActualizar(actualizado)
            exito('Perfil actualizado correctamente')
        })
    }

    return (
        <form onSubmit={manejarSubmit} className="flex flex-col gap-5" noValidate>
            {errorGlobal && <Alerta tipo="error" mensaje={errorGlobal} />}

            <div className="grid grid-cols-1 gap-4">
                <Input
                    label="Nombre completo"
                    name="nombre"
                    value={valores.nombre}
                    onChange={manejarCambio}
                    error={errores.nombre}
                    requerido
                />
                <Input
                    label="Correo electrónico"
                    value={usuario?.correo || ''}
                    disabled
                    ayuda="El correo no puede modificarse"
                />
                <Input
                    label="Teléfono"
                    name="telefono"
                    type="tel"
                    value={valores.telefono}
                    onChange={manejarCambio}
                />
            </div>

            <Boton type="submit" variante="primario" cargando={cargando} className="self-start">
                Guardar cambios
            </Boton>
        </form>
    )
}

const SeccionContrasena = () => {
    const { exito } = useToast()
    const { valores, errores, enviando, errorGlobal, manejarCambio, manejarEnvio, resetear } =
        useFormulario(
            { contrasenaActual: '', contrasenaNueva: '' },
            validarContrasena
        )

    const manejarSubmit = async (e) => {
        e.preventDefault()
        await manejarEnvio(async (datos) => {
            await authService.cambiarContrasena(datos)
            exito('Contraseña actualizada correctamente')
            resetear()
        })
    }

    return (
        <form onSubmit={manejarSubmit} className="flex flex-col gap-4" noValidate>
            {errorGlobal && <Alerta tipo="error" mensaje={errorGlobal} />}
            <Input
                label="Contraseña actual"
                type="password"
                name="contrasenaActual"
                value={valores.contrasenaActual}
                onChange={manejarCambio}
                error={errores.contrasenaActual}
                requerido
            />
            <Input
                label="Contraseña nueva"
                type="password"
                name="contrasenaNueva"
                value={valores.contrasenaNueva}
                onChange={manejarCambio}
                error={errores.contrasenaNueva}
                ayuda="Mínimo 8 caracteres, una mayúscula y un número"
                requerido
            />
            <Boton type="submit" variante="primario" cargando={enviando} className="self-start">
                Cambiar contraseña
            </Boton>
        </form>
    )
}

const PerfilVendedorPage = () => {
    const { usuario, setUsuario } = useAuth()

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-neutral-900 mb-8">Mi perfil de vendedor</h1>

            <div className="flex flex-col gap-6">
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <RiUserLine size={18} className="text-neutral-500" />
                        <h2 className="text-base font-semibold text-neutral-900">Información personal</h2>
                    </div>
                    <SeccionPerfil usuario={usuario} onActualizar={setUsuario} />
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <RiLockLine size={18} className="text-neutral-500" />
                        <h2 className="text-base font-semibold text-neutral-900">Cambiar contraseña</h2>
                    </div>
                    <SeccionContrasena />
                </div>
            </div>
        </div>
    )
}

export default PerfilVendedorPage