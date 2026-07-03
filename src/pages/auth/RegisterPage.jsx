import { Link, useNavigate } from 'react-router-dom'
import { RiUserLine, RiMailLine, RiLockLine, RiPhoneLine } from 'react-icons/ri'
import { useAuth } from '../../hooks/useAuth.js'
import { useFormulario } from '../../hooks/useFormulario.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Alerta } from '../../components/ui/Alerta.jsx'
import { validarFormularioRegistro } from '../../utils/validaciones.js'

const VALORES_INICIALES = {
    nombre: '',
    correo: '',
    contrasena: '',
    telefono: '',
}

const RegisterPage = () => {
    const { registro } = useAuth()
    const { exito } = useToast()
    const navigate = useNavigate()

    const {
        valores,
        errores,
        enviando,
        errorGlobal,
        manejarCambio,
        manejarEnvio,
    } = useFormulario(VALORES_INICIALES, validarFormularioRegistro)

    const manejarSubmit = async (e) => {
        e.preventDefault()
        await manejarEnvio(async (datos) => {
            const payload = { ...datos }
            if (!payload.telefono) delete payload.telefono
            await registro(payload)
            exito('Cuenta creada correctamente')
            navigate('/', { replace: true })
        })
    }

    return (
        <>
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-neutral-900">Crear cuenta</h1>
                <p className="text-sm text-neutral-500 mt-1">Regístrate para comenzar a comprar</p>
            </div>

            {errorGlobal && (
                <Alerta tipo="error" mensaje={errorGlobal} className="mb-5" />
            )}

            <form onSubmit={manejarSubmit} className="flex flex-col gap-4" noValidate>
                <Input
                    label="Nombre completo"
                    type="text"
                    name="nombre"
                    value={valores.nombre}
                    onChange={manejarCambio}
                    error={errores.nombre}
                    icono={<RiUserLine size={16} />}
                    placeholder="Juan Pérez"
                    requerido
                    autoComplete="name"
                />

                <Input
                    label="Correo electrónico"
                    type="email"
                    name="correo"
                    value={valores.correo}
                    onChange={manejarCambio}
                    error={errores.correo}
                    icono={<RiMailLine size={16} />}
                    placeholder="tu@correo.com"
                    requerido
                    autoComplete="email"
                />

                <Input
                    label="Contraseña"
                    type="password"
                    name="contrasena"
                    value={valores.contrasena}
                    onChange={manejarCambio}
                    error={errores.contrasena}
                    icono={<RiLockLine size={16} />}
                    placeholder="Mínimo 8 caracteres"
                    ayuda="Debe contener al menos una mayúscula y un número"
                    requerido
                    autoComplete="new-password"
                />

                <Input
                    label="Teléfono"
                    type="tel"
                    name="telefono"
                    value={valores.telefono}
                    onChange={manejarCambio}
                    error={errores.telefono}
                    icono={<RiPhoneLine size={16} />}
                    placeholder="+51 999 999 999"
                    autoComplete="tel"
                />

                <Boton
                    type="submit"
                    cargando={enviando}
                    ancho
                    tamanio="lg"
                    className="mt-2"
                >
                    Crear cuenta
                </Boton>
            </form>

            <p className="text-center text-sm text-neutral-500 mt-6">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-neutral-900 font-medium hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </>
    )
}

export default RegisterPage