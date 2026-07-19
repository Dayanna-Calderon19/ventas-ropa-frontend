import { useState } from 'react'
import {
    RiAlertLine,
    RiFileWarningLine,
    RiLightbulbLine,
    RiCheckboxCircleLine,
    RiArrowRightLine,
    RiUserLine,
    RiMailLine,
    RiPhoneLine,
    RiFileTextLine,
} from 'react-icons/ri'
import { crearReclamacion } from '../../services/reclamacion.service.js'

const TIPOS = [
    {
        valor: 'QUEJA',
        etiqueta: 'Queja',
        descripcion: 'Malestar o disconformidad con la atención recibida.',
        Icono: RiAlertLine,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-400',
        activoBg: 'bg-amber-600',
        activoText: 'text-white',
        activoBorder: 'border-amber-600',
        ring: 'ring-amber-500',
    },
    {
        valor: 'RECLAMO',
        etiqueta: 'Reclamo',
        descripcion: 'Disconformidad con un producto, servicio o pedido.',
        Icono: RiFileWarningLine,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-400',
        activoBg: 'bg-red-600',
        activoText: 'text-white',
        activoBorder: 'border-red-600',
        ring: 'ring-red-500',
    },
    {
        valor: 'SUGERENCIA',
        etiqueta: 'Sugerencia',
        descripcion: 'Ideas o recomendaciones para mejorar nuestro servicio.',
        Icono: RiLightbulbLine,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-400',
        activoBg: 'bg-blue-600',
        activoText: 'text-white',
        activoBorder: 'border-blue-600',
        ring: 'ring-blue-500',
    },
]

const TarjetaTipo = ({ tipo, seleccionado, onSeleccionar }) => {
    const { valor, etiqueta, descripcion, Icono, color, bg, border, activoBg, activoText, activoBorder } = tipo
    const activo = seleccionado === valor

    return (
        <button
            type="button"
            onClick={() => onSeleccionar(valor)}
            className={`
                w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${activo
                    ? `${activoBg} ${activoText} ${activoBorder} shadow-md scale-[1.02]`
                    : `bg-white ${border} hover:${bg} hover:shadow-sm`
                }
            `}
        >
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex-shrink-0 ${activo ? 'text-white' : color}`}>
                    <Icono size={22} />
                </div>
                <div>
                    <p className={`font-semibold text-sm ${activo ? 'text-white' : 'text-neutral-900'}`}>
                        {etiqueta}
                    </p>
                    <p className={`text-xs mt-0.5 leading-relaxed ${activo ? 'text-white/80' : 'text-neutral-500'}`}>
                        {descripcion}
                    </p>
                </div>
            </div>
        </button>
    )
}

const LibroReclamacionesPage = () => {
    const [tipo, setTipo] = useState('RECLAMO')
    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [telefono, setTelefono] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [errores, setErrores] = useState({})
    const [enviando, setEnviando] = useState(false)
    const [exito, setExito] = useState(null)

    const validar = () => {
        const e = {}
        if (!nombre.trim() || nombre.trim().length < 2) e.nombre = 'El nombre debe tener al menos 2 caracteres'
        if (!correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) e.correo = 'Ingresa un correo válido'
        if (!descripcion.trim() || descripcion.trim().length < 20) e.descripcion = 'La descripción debe tener al menos 20 caracteres'
        return e
    }

    const manejarEnvio = async (e) => {
        e.preventDefault()
        const erroresValidacion = validar()
        if (Object.keys(erroresValidacion).length > 0) {
            setErrores(erroresValidacion)
            return
        }
        setErrores({})
        setEnviando(true)
        try {
            const resultado = await crearReclamacion({ tipo, nombre, correo, telefono: telefono || undefined, descripcion })
            setExito(resultado.data?.id?.slice(0, 8).toUpperCase() || 'OK')
            setNombre('')
            setCorreo('')
            setTelefono('')
            setDescripcion('')
        } catch (err) {
            setErrores({ global: err?.response?.data?.message || 'Error al enviar. Intenta de nuevo.' })
        } finally {
            setEnviando(false)
        }
    }

    const tipoActual = TIPOS.find(t => t.valor === tipo)

    if (exito) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <RiCheckboxCircleLine size={44} className="text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">¡Registro exitoso!</h1>
                    <p className="text-neutral-500 text-sm mb-4">
                        Tu {tipoActual?.etiqueta.toLowerCase() || 'solicitud'} ha sido registrada correctamente.
                        Nos pondremos en contacto contigo a la brevedad.
                    </p>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-6 py-4 mb-6 inline-block">
                        <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Código de referencia</p>
                        <p className="text-2xl font-mono font-bold text-neutral-900"># {exito}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => setExito(null)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                            Enviar otra solicitud
                        </button>
                        <a
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-700 transition-colors"
                        >
                            Ir al inicio <RiArrowRightLine size={16} />
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            {/* Encabezado */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-600 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                    <RiFileTextLine size={14} />
                    Libro de Reclamaciones
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                    ¿Tienes algún inconveniente?
                </h1>
                <p className="text-neutral-500 text-base max-w-xl mx-auto">
                    Registra tu queja, reclamo o sugerencia. Nos comprometemos a atender tu solicitud
                    en un plazo máximo de <strong className="text-neutral-700">15 días hábiles</strong>.
                </p>
            </div>

            <form onSubmit={manejarEnvio} noValidate>
                {/* Selector de tipo */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-neutral-700 mb-3">
                        Tipo de solicitud <span className="text-red-500">*</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {TIPOS.map(t => (
                            <TarjetaTipo
                                key={t.valor}
                                tipo={t}
                                seleccionado={tipo}
                                onSeleccionar={setTipo}
                            />
                        ))}
                    </div>
                </div>

                {/* Datos personales */}
                <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-4 shadow-sm">
                    <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <RiUserLine size={16} className="text-[#c4956a]" />
                        Datos de contacto
                    </h2>

                    {errores.global && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {errores.global}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium text-neutral-700 block mb-1.5">
                                Nombre completo <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                    <RiUserLine size={16} />
                                </span>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    placeholder="Ej. Juan Pérez"
                                    className={`w-full h-10 pl-9 pr-3 text-sm rounded-lg border bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-colors ${errores.nombre ? 'border-red-400 focus:ring-red-400' : 'border-neutral-300 focus:ring-neutral-900 focus:border-neutral-900'}`}
                                />
                            </div>
                            {errores.nombre && <p className="text-xs text-red-600 mt-1">{errores.nombre}</p>}
                        </div>

                        {/* Correo */}
                        <div>
                            <label className="text-sm font-medium text-neutral-700 block mb-1.5">
                                Correo electrónico <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                    <RiMailLine size={16} />
                                </span>
                                <input
                                    type="email"
                                    value={correo}
                                    onChange={e => setCorreo(e.target.value)}
                                    placeholder="tu@correo.com"
                                    className={`w-full h-10 pl-9 pr-3 text-sm rounded-lg border bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-colors ${errores.correo ? 'border-red-400 focus:ring-red-400' : 'border-neutral-300 focus:ring-neutral-900 focus:border-neutral-900'}`}
                                />
                            </div>
                            {errores.correo && <p className="text-xs text-red-600 mt-1">{errores.correo}</p>}
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="text-sm font-medium text-neutral-700 block mb-1.5">
                                Teléfono <span className="text-neutral-400 text-xs font-normal">(opcional)</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                    <RiPhoneLine size={16} />
                                </span>
                                <input
                                    type="tel"
                                    value={telefono}
                                    onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                    placeholder="987654321"
                                    maxLength={9}
                                    className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Descripción */}
                <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-6 shadow-sm">
                    <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <RiFileTextLine size={16} className="text-[#c4956a]" />
                        Descripción de la {tipoActual?.etiqueta.toLowerCase() || 'solicitud'}
                    </h2>
                    <label className="text-sm font-medium text-neutral-700 block mb-1.5">
                        Detalla tu {tipoActual?.etiqueta.toLowerCase() || 'solicitud'} con la mayor información posible{' '}
                        <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={descripcion}
                        onChange={e => setDescripcion(e.target.value)}
                        rows={5}
                        placeholder={
                            tipo === 'QUEJA'
                                ? 'Describe el motivo de tu queja, indicando fecha, lugar y persona involucrada si corresponde...'
                                : tipo === 'RECLAMO'
                                ? 'Describe el producto o servicio con el que tuviste problemas, número de pedido, etc...'
                                : 'Cuéntanos cómo podríamos mejorar nuestro servicio o productos...'
                        }
                        className={`w-full px-4 py-3 text-sm rounded-lg border bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-colors resize-none ${errores.descripcion ? 'border-red-400 focus:ring-red-400' : 'border-neutral-300 focus:ring-neutral-900 focus:border-neutral-900'}`}
                    />
                    <div className="flex items-center justify-between mt-1">
                        {errores.descripcion
                            ? <p className="text-xs text-red-600">{errores.descripcion}</p>
                            : <p className="text-xs text-neutral-400">Mínimo 20 caracteres</p>
                        }
                        <p className="text-xs text-neutral-400">{descripcion.length} caracteres</p>
                    </div>
                </div>

                {/* Aviso legal */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 mb-6 text-xs text-neutral-500 leading-relaxed">
                    <strong className="text-neutral-700">Aviso:</strong> De acuerdo con el Código de Protección al Consumidor
                    (Ley N° 29571), tienes derecho a registrar tu reclamación. La empresa dará respuesta en un plazo máximo
                    de 15 días hábiles al correo indicado.
                </div>

                {/* Botón enviar */}
                <button
                    type="submit"
                    disabled={enviando}
                    className="w-full h-12 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
                >
                    {enviando ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            Enviar {tipoActual?.etiqueta || 'solicitud'}
                            <RiArrowRightLine size={18} />
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

export default LibroReclamacionesPage
