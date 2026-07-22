import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    RiDashboardLine,
    RiAddCircleLine,
    RiFileListLine,
    RiStackLine,
    RiGroupLine,
    RiUserLine,
    RiLogoutBoxLine,
    RiStoreLine,
    RiCloseLine,
    RiArrowDownSLine
} from 'react-icons/ri'
import { useAuth } from '../../hooks/useAuth.js'
import { useAlertasVendedor } from '../../context/AlertasVendedorContext.jsx'
import { BadgeAlerta } from './BadgeAlerta.jsx'

const ITEMS = [
    { a: '/vendedor', etiqueta: 'Dashboard', Icono: RiDashboardLine, exacto: true },
    { a: '/vendedor/inventario', etiqueta: 'Inventario', Icono: RiStackLine, alertaClave: 'stockBajo' },
    { a: '/vendedor/historial', etiqueta: 'Historial', Icono: RiFileListLine },
    { a: '/vendedor/clientes', etiqueta: 'Clientes', Icono: RiGroupLine },
]

const ItemNav = ({ item, alertas, onClick }) => {
    const { a, etiqueta, Icono, exacto, alertaClave } = item
    const count = alertaClave ? (alertas[alertaClave] ?? 0) : 0

    return (
        <NavLink
            to={a}
            end={exacto}
            onClick={onClick}
            className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 ${isActive
                    ? 'bg-white/12 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/6'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icono
                        size={16}
                        className={`flex-shrink-0 transition-colors ${isActive ? 'text-[#b8933f]' : 'text-neutral-500 group-hover:text-neutral-300'}`}
                    />
                    <span className="flex-1 truncate">{etiqueta}</span>
                    <BadgeAlerta count={count} variante="alerta" />
                </>
            )}
        </NavLink>
    )
}

export const SidebarVendedor = ({ cerrar = null }) => {
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()
    const { alertas } = useAlertasVendedor()
    const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)

    const manejarLogout = () => {
        logout()
        navigate('/login')
    }

    const manejarNuevaVenta = () => {
        navigate('/vendedor/nueva-venta')
        cerrar?.()
    }

    return (
        <aside
            className="flex flex-col h-full w-[220px] flex-shrink-0"
            style={{ background: 'linear-gradient(180deg, #111111 0%, #0d0d0d 100%)' }}
        >
            {/* Logo */}
            <div className="flex items-center justify-between px-4 h-[60px] border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-[#b8933f] flex items-center justify-center flex-shrink-0">
                        <RiStoreLine size={15} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-white tracking-tight leading-none">Tienda</p>
                        <p className="text-[10px] text-neutral-500 leading-none mt-0.5">Panel Vendedor</p>
                    </div>
                </div>
                {cerrar && (
                    <button onClick={cerrar} className="text-neutral-500 hover:text-white transition-colors p-1">
                        <RiCloseLine size={18} />
                    </button>
                )}
            </div>

            {/* CTA principal */}
            <div className="px-3 pt-4">
                <button
                    onClick={manejarNuevaVenta}
                    className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-[#b8933f] hover:bg-[#8f7130] text-white text-[13px] font-semibold transition-colors shadow-lg shadow-[#b8933f]/20"
                >
                    <RiAddCircleLine size={17} />
                    Nueva venta
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="flex flex-col gap-0.5">
                    {ITEMS.map((item) => (
                        <li key={item.a}>
                            <ItemNav item={item} alertas={alertas} onClick={cerrar} />
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Usuario */}
            <div className="px-3 pb-4 flex-shrink-0 border-t border-white/5 pt-3">
                <div className="relative">
                    <button
                        onClick={() => setMenuUsuarioAbierto((p) => !p)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/6 transition-colors group"
                    >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#b8933f] to-[#8f7130] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {usuario?.nombre?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-[13px] font-medium text-white truncate leading-none">
                                {usuario?.nombre}
                            </p>
                            <p className="text-[11px] text-neutral-500 truncate mt-0.5 leading-none">
                                Vendedor
                            </p>
                        </div>
                        <RiArrowDownSLine 
                            size={14}
                            className={`text-neutral-500 flex-shrink-0 transition-transform duration-200 ${menuUsuarioAbierto ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {menuUsuarioAbierto && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuUsuarioAbierto(false)} />
                            <div className="absolute bottom-full left-0 right-0 mb-1 z-20 bg-neutral-800 border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                                <NavLink
                                    to="/vendedor/perfil"
                                    onClick={() => { setMenuUsuarioAbierto(false); cerrar?.() }}
                                    className="flex items-center gap-3 px-4 py-3 text-[13px] text-neutral-300 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    <RiUserLine size={15} />
                                    Mi perfil
                                </NavLink>
                                <div className="border-t border-white/5" />
                                <button
                                    onClick={manejarLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                >
                                    <RiLogoutBoxLine size={15} />
                                    Cerrar sesión
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </aside>
    )
}