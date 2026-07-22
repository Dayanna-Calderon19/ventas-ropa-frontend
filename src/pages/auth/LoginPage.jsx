import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { useAuth } from '../../hooks/useAuth.js'
import { useFormulario } from '../../hooks/useFormulario.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Alerta } from '../../components/ui/Alerta.jsx'
import { validarFormularioLogin } from '../../utils/validaciones.js'

const VALORES_INICIALES = { correo: '', contrasena: '' }

const REDIRECCION_POR_ROL = {
    ADMIN: '/admin',
    VENDEDOR: '/vendedor',
    CLIENTE: '/',
}

const LoginPage = () => {
    const { login } = useAuth()
    const { exito } = useToast()
    const navigate = useNavigate()
    const location = useLocation()
    const [mostrarContrasena, setMostrarContrasena] = useState(false)

    const {
        valores,
        errores,
        enviando,
        errorGlobal,
        manejarCambio,
        manejarEnvio,
    } = useFormulario(VALORES_INICIALES, validarFormularioLogin)

    const manejarSubmit = async (e) => {
        e.preventDefault()
        await manejarEnvio(async (datos) => {
            const resultado = await login(datos)
            const usuario = resultado.data.usuario
            exito(`Bienvenido, ${usuario.nombre}`)
            const desde = location.state?.desde?.pathname
            const destino = desde || REDIRECCION_POR_ROL[usuario.rol] || '/'
            navigate(destino, { replace: true })
        })
    }

    return (
        <>
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-neutral-900">Iniciar sesión</h1>
                <p className="text-sm text-neutral-500 mt-1">Ingresa a tu cuenta para continuar</p>
            </div>

            {errorGlobal && (
                <Alerta tipo="error" mensaje={errorGlobal} className="mb-5" />
            )}

            <form onSubmit={manejarSubmit} className="flex flex-col gap-4" noValidate>
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
                    type={mostrarContrasena ? 'text' : 'password'}
                    name="contrasena"
                    value={valores.contrasena}
                    onChange={manejarCambio}
                    error={errores.contrasena}
                    icono={<RiLockLine size={16} />}
                    iconoDerecha={
                        <button
                            type="button"
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                            className="text-neutral-500 hover:text-neutral-700"
                        >
                            {mostrarContrasena ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                        </button>
                    }
                    placeholder="••••••••"
                    requerido
                    autoComplete="current-password"
                />

                <Boton
                    type="submit"
                    variante="tierra"
                    cargando={enviando}
                    ancho
                    tamanio="lg"
                    className="mt-2"
                >
                    Ingresar
                </Boton>
            </form>

            <p className="text-center text-sm text-neutral-500 mt-6">
                ¿No tienes cuenta?{' '}
                <Link to="/registro" className="text-neutral-900 font-medium hover:underline">
                    Regístrate
                </Link>
            </p>
        </>
    )
}

export default LoginPage