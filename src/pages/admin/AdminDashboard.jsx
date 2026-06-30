import { Link } from 'react-router-dom'
import {
    RiGroupLine, RiShirtLine, RiAlertLine,
    RiShoppingCartLine, RiArrowRightLine, RiFileListLine,
} from 'react-icons/ri'
import { TarjetaResumen } from '../../components/admin/TarjetaResumen.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { useResumenGeneral } from '../../hooks/useReportes.js'
import { useStockBajo } from '../../hooks/useInventario.js'
import { usePedidos } from '../../hooks/usePedidos.js'
import { formatearMoneda, formatearFechaHora } from '../../utils/formato.js'
import { ESTADO_PEDIDO_COLOR, ESTADO_PEDIDO_ETIQUETA } from '../../utils/constantes.js'

const AdminDashboard = () => {
    const { datos: resumen, cargando: cargandoResumen } = useResumenGeneral()
    const { datos: stockBajo, cargando: cargandoStock } = useStockBajo()
    const { datos: pedidosPendientes, cargando: cargandoPedidos } = usePedidos({ estado: 'PENDIENTE', limit: 5 })

    return (
        <div className="p-6 flex flex-col gap-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-xl font-bold text-neutral-900">Dashboard</h1>
                <p className="text-sm text-neutral-500 mt-0.5">Resumen general del negocio</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <TarjetaResumen
                    titulo="Ventas hoy"
                    valor={formatearMoneda(resumen?.ventas?.hoy?.total ?? 0)}
                    subtitulo={`${resumen?.ventas?.hoy?.cantidad ?? 0} transacciones`}
                    Icono={RiShoppingCartLine}
                    color="verde"
                    cargando={cargandoResumen}
                />
                <TarjetaResumen
                    titulo="Ventas del mes"
                    valor={formatearMoneda(resumen?.ventas?.mes?.total ?? 0)}
                    subtitulo={`${resumen?.ventas?.mes?.cantidad ?? 0} transacciones`}
                    Icono={RiBarChartIcon}
                    color="azul"
                    cargando={cargandoResumen}
                />
                <TarjetaResumen
                    titulo="Usuarios activos"
                    valor={resumen?.usuarios?.total ?? 0}
                    subtitulo={`${resumen?.usuarios?.total ?? 0} usuarios registrados`}
                    Icono={RiGroupLine}
                    color="tierra"
                    cargando={cargandoResumen}
                />
                <TarjetaResumen
                    titulo="Pedidos pendientes"
                    valor={resumen?.pedidos?.pendientes ?? 0}
                    subtitulo={`${resumen?.pedidos?.pendientes ?? 0} pedidos por procesar`}
                    Icono={RiFileListLine}
                    color={resumen?.pedidos?.pendientes > 0 ? 'naranja' : 'neutral'}
                    cargando={cargandoResumen}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                        <div className="flex items-center gap-2">
                            <RiAlertLine size={16} className="text-orange-500" />
                            <h2 className="text-sm font-semibold text-neutral-900">Stock bajo</h2>
                            {!cargandoStock && stockBajo?.length > 0 && (
                                <Badge variante="alerta">{stockBajo.length}</Badge>
                            )}
                        </div>
                        <Link to="/admin/inventario?stockBajo=true" className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors">
                            Ver todos <RiArrowRightLine size={13} />
                        </Link>
                    </div>
                    <div className="divide-y divide-neutral-100">
                        {cargandoStock ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="px-5 py-3 flex justify-between items-center">
                                    <div className="h-4 w-40 bg-neutral-200 rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
                                </div>
                            ))
                        ) : stockBajo?.length === 0 ? (
                            <p className="px-5 py-6 text-sm text-neutral-400 text-center">Sin alertas de stock</p>
                        ) : (
                            stockBajo?.slice(0, 6).map((v) => (
                                <div key={v.id} className="flex items-center justify-between px-5 py-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate">{v.producto?.nombre}</p>
                                        <p className="text-xs text-neutral-500">{v.talla} · {v.color}</p>
                                    </div>
                                    <Badge variante={v.stock === 0 ? 'error' : 'alerta'}>
                                        {v.stock === 0 ? 'Agotado' : `${v.stock} uds`}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                        <div className="flex items-center gap-2">
                            <RiFileListLine size={16} className="text-neutral-500" />
                            <h2 className="text-sm font-semibold text-neutral-900">Pedidos recientes</h2>
                        </div>
                        <Link to="/admin/pedidos" className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors">
                            Ver todos <RiArrowRightLine size={13} />
                        </Link>
                    </div>
                    <div className="divide-y divide-neutral-100">
                        {cargandoPedidos ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="px-5 py-3 flex justify-between items-center">
                                    <div className="h-4 w-40 bg-neutral-200 rounded animate-pulse" />
                                    <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
                                </div>
                            ))
                        ) : !pedidosPendientes?.length ? (
                            <p className="px-5 py-6 text-sm text-neutral-400 text-center">Sin pedidos pendientes</p>
                        ) : (
                            pedidosPendientes?.map((p) => (
                                <Link
                                    key={p.id}
                                    to={`/admin/pedidos/${p.id}`}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50 transition-colors"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900">#{p.id.slice(0, 8).toUpperCase()}</p>
                                        <p className="text-xs text-neutral-500">{formatearFechaHora(p.creadoEn)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variante={ESTADO_PEDIDO_COLOR[p.estado]}>{ESTADO_PEDIDO_ETIQUETA[p.estado]}</Badge>
                                        <span className="text-sm font-semibold text-neutral-900">{formatearMoneda(p.total)}</span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const RiBarChartIcon = RiShoppingCartLine
export default AdminDashboard