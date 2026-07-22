import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { RiUserLine, RiMailLine, RiLockLine, RiPhoneLine, RiEyeLine, RiEyeOffLine, RiCheckLine, RiCloseLine } from 'react-icons/ri'
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
    confirmarContrasena: '',
    telefono: '',
    aceptaTerminos: false,
}

const REGLAS_CONTRASENA = [
    { clave: 'longitud', etiqueta: 'Mínimo 8 caracteres', cumple: (v) => v.length >= 8 },
    { clave: 'mayuscula', etiqueta: 'Una letra mayúscula', cumple: (v) => /[A-Z]/.test(v) },
    { clave: 'numero', etiqueta: 'Un número', cumple: (v) => /[0-9]/.test(v) },
]

const IndicadorContrasena = ({ contrasena }) => {
    if (!contrasena) return null

    const cumplidas = REGLAS_CONTRASENA.filter((r) => r.cumple(contrasena)).length
    const nivel = cumplidas <= 1 ? 'Débil' : cumplidas === 2 ? 'Media' : 'Fuerte'
    const colorBarra = cumplidas <= 1 ? 'bg-red-500' : cumplidas === 2 ? 'bg-amber-500' : 'bg-green-500'
    const colorTexto = cumplidas <= 1 ? 'text-red-600' : cumplidas === 2 ? 'text-amber-600' : 'text-green-600'

    return (
        <div className="flex flex-col gap-2 -mt-2">
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-300 ${colorBarra}`}
                        style={{ width: `${(cumplidas / REGLAS_CONTRASENA.length) * 100}%` }}
                    />
                </div>
                <span className={`text-xs font-semibold ${colorTexto}`}>{nivel}</span>
            </div>
            <ul className="flex flex-col gap-1">
                {REGLAS_CONTRASENA.map((r) => {
                    const ok = r.cumple(contrasena)
                    return (
                        <li
                            key={r.clave}
                            className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600' : 'text-neutral-400'}`}
                        >
                            {ok ? <RiCheckLine size={14} /> : <RiCloseLine size={14} />}
                            {r.etiqueta}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

const RegisterPage = () => {
    const { registro } = useAuth()
    const { exito } = useToast()
    const navigate = useNavigate()
    const [mostrarContrasena, setMostrarContrasena] = useState(false)
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false)

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
            const { confirmarContrasena, aceptaTerminos, ...payload } = datos
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
                    placeholder="Mínimo 8 caracteres"
                    requerido
                    autoComplete="new-password"
                />

                <IndicadorContrasena contrasena={valores.contrasena} />

                <Input
                    label="Confirmar contraseña"
                    type={mostrarConfirmar ? 'text' : 'password'}
                    name="confirmarContrasena"
                    value={valores.confirmarContrasena}
                    onChange={manejarCambio}
                    error={errores.confirmarContrasena}
                    icono={<RiLockLine size={16} />}
                    iconoDerecha={
                        <button
                            type="button"
                            onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                            className="text-neutral-500 hover:text-neutral-700"
                        >
                            {mostrarConfirmar ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                        </button>
                    }
                    placeholder="Repite tu contraseña"
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

                <div>
                    <label className="flex items-start gap-2.5 text-sm text-neutral-600 cursor-pointer">
                        <input
                            type="checkbox"
                            name="aceptaTerminos"
                            checked={valores.aceptaTerminos}
                            onChange={manejarCambio}
                            className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-[#b8933f] focus:ring-[#b8933f] cursor-pointer"
                        />
                        <span>
                            Acepto los <strong>Términos y Condiciones</strong> y la <strong>Política de Privacidad</strong>
                        </span>
                    </label>
                    {errores.aceptaTerminos && (
                        <p className="text-xs text-red-600 mt-1.5">{errores.aceptaTerminos}</p>
                    )}
                </div>

                <Boton
                    type="submit"
                    variante="tierra"
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
