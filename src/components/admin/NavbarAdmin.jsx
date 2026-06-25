import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
    RiMenuLine,
    RiSearchLine,
    RiBellLine,
    RiAlertLine,
    RiFileListLine,
    RiCloseLine,
    RiArrowRightLine,
    RiCheckLine,
    RiStoreLine,
} from 'react-icons/ri'
import { useAuth } from '../../hooks/useAuth.js'
import { useAlertas } from '../../context/AlertasContext.jsx'

const RUTAS_ETIQUETAS = {
    '/admin': 'Dashboard',
    '/admin/productos': 'Productos',
    '/admin/categorias': 'Categorías',
    '/admin/inventario': 'Inventario',
    '/admin/ventas': 'Ventas',
    '/admin/pedidos': 'Pedidos web',
    '/admin/promociones': 'Promociones',
    '/admin/clientes': 'Clientes',
    '/admin/usuarios': 'Usuarios',
    '/admin/reportes': 'Reportes',
    '/admin/configuracion': 'Configuración',
}

const BUSQUEDA_ACCESOS = [
    { etiqueta: 'Dashboard', a: '/admin', grupo: 'Navegación' },
    { etiqueta: 'Productos', a: '/admin/productos', grupo: 'Navegación' },
    { etiqueta: 'Nuevo producto', a: '/admin/productos', grupo: 'Acciones' },
    { etiqueta: 'Categorías', a: '/admin/categorias', grupo: 'Navegación' },
    { etiqueta: 'Inventario', a: '/admin/inventario', grupo: 'Navegación' },
    { etiqueta: 'Stock bajo', a: '/admin/inventario?stockBajo=true', grupo: 'Acciones' },
    { etiqueta: 'Ventas', a: '/admin/ventas', grupo: 'Navegación' },
    { etiqueta: 'Pedidos web', a: '/admin/pedidos', grupo: 'Navegación' },
    { etiqueta: 'Pendientes', a: '/admin/pedidos?estado=PENDIENTE', grupo: 'Acciones' },
    { etiqueta: 'Promociones', a: '/admin/promociones', grupo: 'Navegación' },
    { etiqueta: 'Clientes', a: '/admin/clientes', grupo: 'Navegación' },
    { etiqueta: 'Usuarios', a: '/admin/usuarios', grupo: 'Navegación' },
    { etiqueta: 'Reportes', a: '/admin/reportes', grupo: 'Navegación' },
    { etiqueta: 'Configuración', a: '/admin/configuracion', grupo: 'Navegación' },
]

const Breadcrumb = () => {
    const location = useLocation()
    const segmentos = location.pathname.split('/').filter(Boolean)

    const rutas = segmentos.reduce((acc, _, i) => {
        const ruta = '/' + segmentos.slice(0, i + 1).join('/')
        const etiqueta = RUTAS_ETIQUETAS[ruta]
        if (etiqueta) acc.push({ ruta, etiqueta })
        return acc
    }, [])

    if (rutas.length <= 1) {
        return (
            <h1 className="text-[15px] font-semibold text-neutral-900">
                {rutas[0]?.etiqueta ?? 'Dashboard'}
            </h1>
        )
    }

    return (
        <div className="flex items-center gap-1.5 text-[13px]">
            {rutas.map((r, i) => (
                <span key={r.ruta} className="flex items-center gap-1.5">
                    {i < rutas.length - 1 ? (
                        <>
                            <Link to={r.ruta} className="text-neutral-400 hover:text-neutral-700 transition-colors">
                                {r.etiqueta}
                            </Link>
                            <span className="text-neutral-300">/</span>
                        </>
                    ) : (
                        <span className="font-semibold text-neutral-900">{r.etiqueta}</span>
                    )}
                </span>
            ))}
        </div>
    )
}

const BuscadorGlobal = () => {
    const [abierto, setAbierto] = useState(false)
    const [termino, setTermino] = useState('')
    const navigate = useNavigate()
    const inputRef = useRef(null)

    const resultados = termino.trim()
        ? BUSQUEDA_ACCESOS.filter((a) =>
            a.etiqueta.toLowerCase().includes(termino.toLowerCase())
        ).slice(0, 6)
        : BUSQUEDA_ACCESOS.slice(0, 6)

    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setAbierto(true)
                setTimeout(() => inputRef.current?.focus(), 50)
            }
            if (e.key === 'Escape') setAbierto(false)
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [])

    const manejarSeleccion = (a) => {
        navigate(a)
        setAbierto(false)
        setTermino('')
    }

    const grupos = [...new Set(resultados.map((r) => r.grupo))]

    return (
        <>
            <button
                onClick={() => { setAbierto(true); setTimeout(() => inputRef.current?.focus(), 50) }}
                className="flex items-center gap-2 px-3 h-9 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-700 transition-all text-[13px] w-56"
            >
                <RiSearchLine size={15} />
                <span className="flex-1 text-left">Buscar...</span>
                <span className="text-[11px] text-neutral-400 bg-white border border-neutral-200 px-1.5 py-0.5 rounded font-mono">
                    ⌘K
                </span>
            </button>

            {abierto && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setAbierto(false)}
                    />
                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
                            <RiSearchLine size={17} className="text-neutral-400 flex-shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={termino}
                                onChange={(e) => setTermino(e.target.value)}
                                placeholder="Buscar módulo o acción..."
                                className="flex-1 text-sm text-neutral-900 placeholder-neutral-400 outline-none bg-transparent"
                            />
                            {termino && (
                                <button onClick={() => setTermino('')} className="text-neutral-400 hover:text-neutral-700">
                                    <RiCloseLine size={16} />
                                </button>
                            )}
                        </div>

                        <div className="max-h-72 overflow-y-auto py-2">
                            {!resultados.length ? (
                                <p className="text-sm text-neutral-400 text-center py-6">Sin resultados</p>
                            ) : (
                                grupos.map((grupo) => (
                                    <div key={grupo}>
                                        <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                                            {grupo}
                                        </p>
                                        {resultados
                                            .filter((r) => r.grupo === grupo)
                                            .map((r) => (
                                                <button
                                                    key={r.a + r.etiqueta}
                                                    onClick={() => manejarSeleccion(r.a)}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                                                >
                                                    <RiArrowRightLine size={14} className="text-neutral-400 flex-shrink-0" />
                                                    {r.etiqueta}
                                                </button>
                                            ))}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="px-4 py-2.5 border-t border-neutral-100 flex items-center gap-4 text-[11px] text-neutral-400">
                            <span className="flex items-center gap-1">
                                <kbd className="bg-neutral-100 border border-neutral-200 rounded px-1 py-0.5 font-mono">↵</kbd>
                                seleccionar
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="bg-neutral-100 border border-neutral-200 rounded px-1 py-0.5 font-mono">Esc</kbd>
                                cerrar
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

const PanelNotificaciones = ({ onCerrar }) => {
    const { alertas, refrescar } = useAlertas()
    const navigate = useNavigate()

    const notificaciones = [
        alertas.pedidosPendientes > 0 && {
            id: 'pedidos',
            tipo: 'info',
            mensaje: `${alertas.pedidosPendientes} pedido${alertas.pedidosPendientes > 1 ? 's' : ''} pendiente${alertas.pedidosPendientes > 1 ? 's' : ''} de atender`,
            accion: () => { navigate('/admin/pedidos?estado=PENDIENTE'); onCerrar() },
            etiquetaAccion: 'Ver pedidos',
        },
        alertas.stockAgotado > 0 && {
            id: 'agotado',
            tipo: 'error',
            mensaje: `${alertas.stockAgotado} variante${alertas.stockAgotado > 1 ? 's' : ''} sin stock`,
            accion: () => { navigate('/admin/inventario?stockBajo=true'); onCerrar() },
            etiquetaAccion: 'Ver inventario',
        },
        alertas.stockBajo > 0 && {
            id: 'bajo',
            tipo: 'alerta',
            mensaje: `${alertas.stockBajo} variante${alertas.stockBajo > 1 ? 's' : ''} con stock bajo`,
            accion: () => { navigate('/admin/inventario?stockBajo=true'); onCerrar() },
            etiquetaAccion: 'Ver inventario',
        },
    ].filter(Boolean)

    const colores = {
        error: 'bg-red-50 border-red-100',
        alerta: 'bg-orange-50 border-orange-100',
        info: 'bg-blue-50 border-blue-100',
    }
    const iconoColor = {
        error: 'text-red-500',
        alerta: 'text-orange-500',
        info: 'text-blue-500',
    }

    return (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                <p className="text-sm font-semibold text-neutral-900">Notificaciones</p>
                <button
                    onClick={refrescar}
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                    Actualizar
                </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
                {!notificaciones.length ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <RiCheckLine size={24} className="text-green-500" />
                        <p className="text-sm text-neutral-500">Todo en orden</p>
                    </div>
                ) : (
                    <div className="p-3 flex flex-col gap-2">
                        {notificaciones.map((n) => (
                            <div
                                key={n.id}
                                className={`flex flex-col gap-2 p-3 rounded-lg border ${colores[n.tipo]}`}
                            >
                                <div className="flex items-start gap-2">
                                    <RiAlertLine size={15} className={`flex-shrink-0 mt-0.5 ${iconoColor[n.tipo]}`} />
                                    <p className="text-[13px] text-neutral-800 flex-1">{n.mensaje}</p>
                                </div>
                                <button
                                    onClick={n.accion}
                                    className={`text-[12px] font-medium self-end flex items-center gap-1 transition-colors ${iconoColor[n.tipo]} hover:opacity-70`}
                                >
                                    {n.etiquetaAccion}
                                    <RiArrowRightLine size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="px-4 py-2.5 border-t border-neutral-100">
                <Link
                    to="/admin"
                    onClick={onCerrar}
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                    Ver dashboard completo →
                </Link>
            </div>
        </div>
    )
}

export const NavbarAdmin = ({ onAbrirSidebar }) => {
    const { usuario } = useAuth()
    const { alertas } = useAlertas()
    const [notificacionesAbierto, setNotificacionesAbierto] = useState(false)

    const totalAlertas = alertas.pedidosPendientes + alertas.stockAgotado + alertas.stockBajo

    return (
        <header className="h-[60px] flex-shrink-0 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 gap-4">
            <div className="flex items-center gap-3">
                <button
                    onClick={onAbrirSidebar}
                    className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                    <RiMenuLine size={18} />
                </button>

                <div className="hidden sm:block">
                    <Breadcrumb />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden md:block">
                    <BuscadorGlobal />
                </div>

                <Link
                    to="/"
                    className="flex items-center gap-2 px-3 h-9 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors text-[13px] font-medium"
                >
                    <RiStoreLine size={18} />
                    <span className="hidden lg:block">Ver sitio</span>
                </Link>

                <div className="relative">
                    <button
                        onClick={() => setNotificacionesAbierto((p) => !p)}
                        className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                    >
                        <RiBellLine size={18} />
                        {totalAlertas > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                    </button>

                    {notificacionesAbierto && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setNotificacionesAbierto(false)}
                            />
                            <div className="relative z-50">
                                <PanelNotificaciones onCerrar={() => setNotificacionesAbierto(false)} />
                            </div>
                        </>
                    )}
                </div>

                <div className="w-px h-6 bg-neutral-200 mx-1" />

                <Link
                    to="/admin/configuracion"
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c4956a] to-[#a37550] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {usuario?.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-[13px] font-medium text-neutral-700 max-w-[120px] truncate">
                        {usuario?.nombre?.split(' ')[0]}
                    </span>
                </Link>
            </div>
        </header>
    )
}