import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    RiDashboardLine,
    RiShirtLine,
    RiStackLine,
    RiShoppingCartLine,
    RiFileListLine,
    RiGroupLine,
    RiUserLine,
    RiBarChartLine,
    RiCouponLine,
    RiSettings3Line,
    RiLogoutBoxLine,
    RiStoreLine,
    RiCloseLine,
    RiArrowDownSLine,
    RiAlertLine,
    RiShieldUserLine,
    RiFileTextLine,
} from 'react-icons/ri'
import { useAuth } from '../../hooks/useAuth.js'
import { useAlertas } from '../../context/AlertasContext.jsx'
import { BadgeAlerta } from './BadgeAlerta.jsx'

const GRUPOS = [
    {
        grupo: 'Principal',
        items: [
            {
                a: '/admin',
                etiqueta: 'Dashboard',
                Icono: RiDashboardLine,
                exacto: true,
            },
        ],
    },
    {
        grupo: 'Catálogo',
        items: [
            { a: '/admin/productos', etiqueta: 'Productos', Icono: RiShirtLine },
            { a: '/admin/categorias', etiqueta: 'Categorías', Icono: RiStackLine },
            { a: '/admin/inventario', etiqueta: 'Inventario', Icono: RiAlertLine, alertaClave: 'stockBajo' },
        ],
    },
    {
        grupo: 'Ventas',
        items: [
            { a: '/admin/ventas', etiqueta: 'Ventas', Icono: RiShoppingCartLine },
            { a: '/admin/pedidos', etiqueta: 'Pedidos web', Icono: RiFileListLine, alertaClave: 'pedidosPendientes' },
            { a: '/admin/promociones', etiqueta: 'Promociones', Icono: RiCouponLine },
        ],
    },
    {
        grupo: 'Personas',
        items: [
            { a: '/admin/clientes', etiqueta: 'Clientes', Icono: RiGroupLine },
            { a: '/admin/usuarios', etiqueta: 'Usuarios', Icono: RiShieldUserLine },
            { a: '/admin/reclamaciones', etiqueta: 'Reclamaciones', Icono: RiFileTextLine },
        ],
    },
    {
        grupo: 'Análisis',
        items: [
            { a: '/admin/reportes', etiqueta: 'Reportes', Icono: RiBarChartLine },
        ],
    },
    {
        grupo: 'Sistema',
        items: [
            { a: '/admin/configuracion', etiqueta: 'Configuración', Icono: RiSettings3Line },
        ],
    },
]

const ItemNav = ({ item, alertas, onClick }) => {
    const { a, etiqueta, Icono, exacto, alertaClave } = item
    const count = alertaClave ? (alertas[alertaClave] ?? 0) : 0
    const variante = alertaClave === 'pedidosPendientes' ? 'info' : 'alerta'

    return (
        <NavLink
            to={a}
            end={exacto}
            onClick={onClick}
            className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150 ${isActive
                    ? 'bg-white/12 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/6'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icono
                        size={16}
                        className={`flex-shrink-0 transition-colors ${isActive ? 'text-[#c4956a]' : 'text-neutral-500 group-hover:text-neutral-300'}`}
                    />
                    <span className="flex-1 truncate">{etiqueta}</span>
                    <BadgeAlerta count={count} variante={variante} />
                </>
            )}
        </NavLink>
    )
}

const GrupoNav = ({ grupo, items, alertas, onClick }) => {
    const totalAlertas = items.reduce((acc, item) => {
        if (item.alertaClave) return acc + (alertas[item.alertaClave] ?? 0)
        return acc
    }, 0)

    return (
        <div className="mb-1">
            <div className="flex items-center justify-between px-3 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                    {grupo}
                </span>
                {totalAlertas > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c4956a] flex-shrink-0" />
                )}
            </div>
            <ul className="flex flex-col gap-0.5">
                {items.map((item) => (
                    <li key={item.a}>
                        <ItemNav item={item} alertas={alertas} onClick={onClick} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export const SidebarAdmin = ({ cerrar = null }) => {
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()
    const { alertas } = useAlertas()
    const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)

    const manejarLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <aside
            className="flex flex-col h-full w-[220px] flex-shrink-0"
            style={{ background: 'linear-gradient(180deg, #111111 0%, #0d0d0d 100%)' }}
        >
            <div className="flex items-center justify-between px-4 h-[60px] border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-[#c4956a] flex items-center justify-center flex-shrink-0">
                        <RiStoreLine size={15} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-white tracking-tight leading-none">MODA JELÚ</p>
                        <p className="text-[10px] text-neutral-500 leading-none mt-0.5">Panel Admin</p>
                    </div>
                </div>
                {cerrar && (
                    <button
                        onClick={cerrar}
                        className="text-neutral-500 hover:text-white transition-colors p-1"
                    >
                        <RiCloseLine size={18} />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-4">
                {GRUPOS.map(({ grupo, items }) => (
                    <GrupoNav
                        key={grupo}
                        grupo={grupo}
                        items={items}
                        alertas={alertas}
                        onClick={cerrar}
                    />
                ))}
            </nav>

            <div className="px-3 pb-4 flex-shrink-0 border-t border-white/5 pt-3">
                <div className="relative">
                    <button
                        onClick={() => setMenuUsuarioAbierto((p) => !p)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/6 transition-colors group"
                    >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c4956a] to-[#a37550] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {usuario?.nombre?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-[13px] font-medium text-white truncate leading-none">
                                {usuario?.nombre}
                            </p>
                            <p className="text-[11px] text-neutral-500 truncate mt-0.5 leading-none">
                                {usuario?.correo}
                            </p>
                        </div>
                        <RiArrowDownSLine
                            size={14}
                            className={`text-neutral-500 flex-shrink-0 transition-transform duration-200 ${menuUsuarioAbierto ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {menuUsuarioAbierto && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setMenuUsuarioAbierto(false)}
                            />
                            <div className="absolute bottom-full left-0 right-0 mb-1 z-20 bg-neutral-800 border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                                <NavLink
                                    to="/admin/configuracion"
                                    onClick={() => { setMenuUsuarioAbierto(false); cerrar?.() }}
                                    className="flex items-center gap-3 px-4 py-3 text-[13px] text-neutral-300 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    <RiUserLine size={15} />
                                    Mi cuenta
                                </NavLink>
                                <NavLink
                                    to="/admin/configuracion"
                                    onClick={() => { setMenuUsuarioAbierto(false); cerrar?.() }}
                                    className="flex items-center gap-3 px-4 py-3 text-[13px] text-neutral-300 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    <RiSettings3Line size={15} />
                                    Configuración
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