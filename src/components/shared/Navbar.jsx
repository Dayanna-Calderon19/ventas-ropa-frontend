import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { RiShoppingBagLine, RiUserLine, RiMenuLine, RiCloseLine, RiDashboardLine, RiHeartLine, RiCloseCircleLine } from 'react-icons/ri'
import { useAuth } from '../../hooks/useAuth.js'
import { useCarrito } from '../../hooks/useCarrito.js'
import { useFavoritos } from '../../hooks/useFavoritos.js'

export const Navbar = () => {
    const { estaAutenticado, usuario, logout } = useAuth()
    const { cantidadItems } = useCarrito()
    const { cantidadFavoritos } = useFavoritos()
    const navigate = useNavigate()
    const [menuAbierto, setMenuAbierto] = useState(false)
    const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
    const [anuncioVisible, setAnuncioVisible] = useState(true)
    const [terminoBusqueda, setTerminoBusqueda] = useState('')

    const enlacesNav = [
        { a: '/catalogo', etiqueta: 'Catálogo' },
        { a: '/promociones', etiqueta: 'Promociones' },
    ]

    const manejarLogout = () => {
        logout()
        setMenuUsuarioAbierto(false)
        navigate('/')
    }

    const manejarBusqueda = (e) => {
        e.preventDefault()
        if (!terminoBusqueda.trim()) return
        navigate(`/catalogo?busqueda=${encodeURIComponent(terminoBusqueda.trim())}`)
        setTerminoBusqueda('')
    }

    return (
        <>
            {anuncioVisible && (
                <div className="relative bg-[#3c2a1e] text-white text-xs sm:text-sm font-medium text-center py-2 px-8">
                    Envío gratis en compras desde S/150 a todo el Perú
                    <button
                        onClick={() => setAnuncioVisible(false)}
                        aria-label="Cerrar anuncio"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    >
                        <RiCloseCircleLine size={16} />
                    </button>
                </div>
            )}
            <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="font-display text-2xl font-bold tracking-tight text-neutral-900">
                            MODA JELÚ
                        </Link>
                        {usuario?.rol === 'ADMIN' && (
                            <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-[#c4956a]/10 text-[#c4956a] text-[10px] font-bold uppercase tracking-wider rounded border border-[#c4956a]/20">
                                <RiDashboardLine size={10} />
                                MODO ADMIN
                            </span>
                        )}
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        {enlacesNav.map((e) => (
                            <NavLink
                                key={e.a}
                                to={e.a}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${isActive ? 'text-[#c4956a]' : 'text-neutral-500 hover:text-neutral-900'
                                    }`
                                }
                            >
                                {e.etiqueta}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <form onSubmit={manejarBusqueda} className="flex items-center">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={terminoBusqueda}
                                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                                    placeholder="Buscar productos..."
                                    className="w-36 sm:w-56 h-9 pl-3 pr-8 text-sm rounded-full border border-neutral-300 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#c4956a] focus:border-[#c4956a] focus:bg-white transition-all duration-200"
                                />
                                {terminoBusqueda && (
                                    <button
                                        type="button"
                                        onClick={() => setTerminoBusqueda('')}
                                        aria-label="Limpiar búsqueda"
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors animate-fadeIn"
                                    >
                                        <RiCloseLine size={14} />
                                    </button>
                                )}
                            </div>
                        </form>

                        {estaAutenticado && (
                            <Link
                                to="/favoritos"
                                className="relative p-2 rounded text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                            >
                                <RiHeartLine size={20} />
                                {cantidadFavoritos > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#c4956a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {cantidadFavoritos > 9 ? '9+' : cantidadFavoritos}
                                    </span>
                                )}
                            </Link>
                        )}

                        <Link
                            to={estaAutenticado ? '/cliente/carrito' : '/login'}
                            className="relative p-2 rounded text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        >
                            <RiShoppingBagLine size={20} />
                            {cantidadItems > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-[#c4956a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {cantidadItems > 9 ? '9+' : cantidadItems}
                                </span>
                            )}
                        </Link>

                        {estaAutenticado ? (
                            <div className="relative">
                                <button
                                    onClick={() => setMenuUsuarioAbierto((p) => !p)}
                                    className="flex items-center gap-2 p-2 rounded hover:bg-neutral-100 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-[#c4956a] text-white text-xs font-semibold flex items-center justify-center">
                                        {usuario?.nombre?.charAt(0).toUpperCase()}
                                    </div>
                                </button>
                                {menuUsuarioAbierto && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setMenuUsuarioAbierto(false)} />
                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1">
                                            <div className="px-4 py-2 border-b border-neutral-100">
                                                <p className="text-sm font-medium text-neutral-900 truncate">{usuario?.nombre}</p>
                                                <p className="text-xs text-neutral-500 truncate">{usuario?.correo}</p>
                                            </div>
                                            
                                            {/* Opciones según Rol */}
                                            {usuario?.rol === 'ADMIN' && (
                                                <Link
                                                    to="/admin"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#c4956a] font-semibold hover:bg-neutral-50 transition-colors"
                                                    onClick={() => setMenuUsuarioAbierto(false)}
                                                >
                                                    <RiDashboardLine size={16} />
                                                    Panel Admin
                                                </Link>
                                            )}

                                            {usuario?.rol === 'VENDEDOR' && (
                                                <Link
                                                    to="/vendedor"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#c4956a] font-semibold hover:bg-neutral-50 transition-colors"
                                                    onClick={() => setMenuUsuarioAbierto(false)}
                                                >
                                                    <RiDashboardLine size={16} />
                                                    Panel Vendedor
                                                </Link>
                                            )}

                                            {/* Opciones de Cliente */}
                                            {usuario?.rol === 'CLIENTE' && (
                                                <>
                                                    <Link
                                                        to="/cliente/pedidos"
                                                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                        onClick={() => setMenuUsuarioAbierto(false)}
                                                    >
                                                        Mis pedidos
                                                    </Link>
                                                    <Link
                                                        to="/cliente/perfil"
                                                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                        onClick={() => setMenuUsuarioAbierto(false)}
                                                    >
                                                        Mi perfil
                                                    </Link>
                                                </>
                                            )}

                                            {/* Opción de perfil genérica para admin/vendedor si es necesario */}
                                            {(usuario?.rol === 'ADMIN' || usuario?.rol === 'VENDEDOR') && (
                                                <Link
                                                    to={`/${usuario.rol.toLowerCase()}/perfil`}
                                                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                    onClick={() => setMenuUsuarioAbierto(false)}
                                                >
                                                    Mi perfil
                                                </Link>
                                            )}
                                            
                                            <button
                                                onClick={manejarLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-50 transition-colors"
                                            >
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="p-2 rounded text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                            >
                                <RiUserLine size={20} />
                            </Link>
                        )}

                        <button
                            className="md:hidden p-2 rounded text-neutral-600 hover:bg-neutral-100 transition-colors"
                            onClick={() => setMenuAbierto((p) => !p)}
                        >
                            {menuAbierto ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
                        </button>
                    </div>
                </div>

                {menuAbierto && (
                    <nav className="md:hidden border-t border-neutral-100 py-3 flex flex-col gap-1">
                        {enlacesNav.map((e) => (
                            <NavLink
                                key={e.a}
                                to={e.a}
                                className="px-2 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 rounded hover:bg-neutral-50 transition-colors"
                                onClick={() => setMenuAbierto(false)}
                            >
                                {e.etiqueta}
                            </NavLink>
                        ))}
                    </nav>
                )}
            </div>
            </header>
        </>
    )
}
