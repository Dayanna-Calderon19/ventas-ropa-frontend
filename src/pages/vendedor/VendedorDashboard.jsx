import { Link } from 'react-router-dom'
import {
    RiShoppingCartLine,
    RiArrowRightLine,
    RiFileListLine,
    RiAlertLine,
    RiErrorWarningLine,
    RiArrowUpLine,
    RiArrowDownLine,
    RiAddCircleLine,
} from 'react-icons/ri'

import { useAuth } from '../../hooks/useAuth.js'
import { useVentas } from '../../hooks/useVentas.js'
import { useStockBajo } from '../../hooks/useInventario.js'

import { TarjetaResumen } from '../../components/admin/TarjetaResumen.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Boton } from '../../components/ui/Boton.jsx'

import { formatearMoneda, formatearFechaHora } from '../../utils/formato.js'

const obtenerFechaISO = (offsetDias = 0) => {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() + offsetDias)
    return fecha.toISOString().split('T')[0]
}

const PanelError = ({ mensaje, onReintentar }) => (
    <div className="flex flex-col items-center justify-center gap-2 px-5 py-8 text-center">
        <RiErrorWarningLine size={22} className="text-red-400" />
        <p className="text-sm text-neutral-500">{mensaje ?? 'No se pudo cargar la información'}</p>
        {onReintentar && (
            <button
                onClick={onReintentar}
                className="text-xs font-medium text-neutral-700 hover:text-neutral-900 underline transition-colors"
            >
                Reintentar
            </button>
        )}
    </div>
)

const VariacionComparativa = ({ actual, anterior }) => {
    if (anterior === 0 && actual === 0) return null
    if (anterior === 0) {
        return (
            <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
                <RiArrowUpLine size={13} /> Primera venta del período
            </span>
        )
    }

    const variacion = ((actual - anterior) / anterior) * 100
    const subio = variacion >= 0
    const Icono = subio ? RiArrowUpLine : RiArrowDownLine

    return (
        <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${subio ? 'text-green-600' : 'text-red-500'}`}>
            <Icono size={13} />
            {Math.abs(variacion).toFixed(0)}% vs ayer
        </span>
    )
}

const VendedorDashboard = () => {
    const { usuario } = useAuth()

    const hoy = obtenerFechaISO(0)
    const ayer = obtenerFechaISO(-1)

    const {
        datos: ventasHoy,
        cargando: cargandoVentasHoy,
        error: errorVentasHoy,
        cargar: recargarVentasHoy,
    } = useVentas({ vendedorId: usuario?.id, fechaDesde: hoy, limit: 5 })

    const {
        datos: ventasAyer,
        cargando: cargandoVentasAyer,
    } = useVentas({ vendedorId: usuario?.id, fechaDesde: ayer, fechaHasta: hoy, limit: 1 })

    const {
        datos: stockBajo,
        cargando: cargandoStock,
        error: errorStock,
        cargar: recargarStock,
    } = useStockBajo()

    const totalHoy = ventasHoy?.data?.reduce((acc, v) => acc + v.total, 0) ?? 0
    const cantidadHoy = ventasHoy?.meta?.total ?? 0

    const totalAyer = ventasAyer?.data?.reduce((acc, v) => acc + v.total, 0) ?? 0

    const agotados = stockBajo?.filter((v) => v.stock === 0).length ?? 0
    const bajos = stockBajo?.filter((v) => v.stock > 0).length ?? 0

    const cargandoComparativa = cargandoVentasHoy || cargandoVentasAyer

    return (
        <div className="p-6 flex flex-col gap-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-xl font-bold text-neutral-900">
                    Hola, {usuario?.nombre?.split(' ')[0]}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">Resumen de tu jornada</p>
            </div>

            {/* CTA principal — primer elemento de la jornada */}
            <div className="bg-neutral-900 rounded-xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-white font-semibold text-base">
                        {cantidadHoy === 0 ? '¿Listo para tu primera venta del día?' : `Llevas ${cantidadHoy} venta${cantidadHoy === 1 ? '' : 's'} hoy`}
                    </p>
                    <p className="text-neutral-400 text-sm mt-0.5">
                        {cantidadHoy === 0
                            ? 'Registra una venta para comenzar a ver tus métricas aquí'
                            : `Total acumulado: ${formatearMoneda(totalHoy)}`}
                    </p>
                </div>
                <Link to="/vendedor/nueva-venta">
                    <Boton variante="tierra" tamanio="lg" icono={<RiAddCircleLine size={18} />}>
                        Nueva venta
                    </Boton>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                    <TarjetaResumen
                        titulo="Ventas hoy"
                        valor={formatearMoneda(totalHoy)}
                        subtitulo={
                            cargandoComparativa
                                ? `${cantidadHoy} transacciones`
                                : undefined
                        }
                        extra={
                            !cargandoComparativa && (
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-neutral-400">{cantidadHoy} transacciones</span>
                                    <VariacionComparativa actual={totalHoy} anterior={totalAyer} />
                                </div>
                            )
                        }
                        Icono={RiShoppingCartLine}
                        color="verde"
                        cargando={cargandoVentasHoy}
                    />
                </div>

                <div className="lg:col-span-1">
                    <TarjetaResumen
                        titulo="Sin stock"
                        valor={agotados}
                        subtitulo="Variantes agotadas"
                        Icono={RiAlertLine}
                        color={agotados > 0 ? 'rojo' : 'neutral'}
                        cargando={cargandoStock}
                    />
                </div>

                <div className="lg:col-span-1">
                    <TarjetaResumen
                        titulo="Stock bajo"
                        valor={bajos}
                        subtitulo="Requieren reposición pronto"
                        Icono={RiAlertLine}
                        color={bajos > 0 ? 'naranja' : 'neutral'}
                        cargando={cargandoStock}
                    />
                </div>
            </div>

            <div className="flex">
                <Link to="/vendedor/historial">
                    <Boton variante="fantasma" tamanio="sm" icono={<RiFileListLine size={15} />}>
                        Ver historial completo
                    </Boton>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                        <h2 className="text-sm font-semibold text-neutral-900">Mis ventas de hoy</h2>
                        <Link
                            to="/vendedor/historial"
                            className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
                        >
                            Ver todas <RiArrowRightLine size={13} />
                        </Link>
                    </div>

                    <div className="divide-y divide-neutral-100">
                        {errorVentasHoy ? (
                            <PanelError mensaje={errorVentasHoy} onReintentar={recargarVentasHoy} />
                        ) : cargandoVentasHoy ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="px-5 py-3 flex justify-between">
                                    <div className="h-4 w-36 bg-neutral-200 rounded animate-pulse" />
                                    <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
                                </div>
                            ))
                        ) : !ventasHoy?.data?.length ? (
                            <p className="px-5 py-8 text-sm text-neutral-400 text-center">
                                Sin ventas registradas hoy
                            </p>
                        ) : (
                            ventasHoy.data.map((venta) => (
                                <Link
                                    key={venta.id}
                                    to={`/vendedor/ventas/${venta.id}`}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50 transition-colors"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900">
                                            {venta.numeroComprobante ?? `#${venta.id.slice(0, 8).toUpperCase()}`}
                                        </p>
                                        <p className="text-xs text-neutral-400">{formatearFechaHora(venta.creadoEn)}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-neutral-900">
                                        {formatearMoneda(venta.total)}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                        <div className="flex items-center gap-2">
                            <RiAlertLine size={15} className="text-orange-500" />
                            <h2 className="text-sm font-semibold text-neutral-900">Stock bajo</h2>
                        </div>
                        <Link
                            to="/vendedor/inventario"
                            className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
                        >
                            Ver todo <RiArrowRightLine size={13} />
                        </Link>
                    </div>

                    <div className="divide-y divide-neutral-100">
                        {errorStock ? (
                            <PanelError mensaje={errorStock} onReintentar={recargarStock} />
                        ) : cargandoStock ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="px-5 py-3 flex justify-between">
                                    <div className="h-4 w-40 bg-neutral-200 rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
                                </div>
                            ))
                        ) : !stockBajo?.length ? (
                            <p className="px-5 py-8 text-sm text-neutral-400 text-center">
                                Todo el stock está en buen nivel
                            </p>
                        ) : (
                            stockBajo.slice(0, 6).map((item) => (
                                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate">
                                            {item.producto?.nombre}
                                        </p>
                                        <p className="text-xs text-neutral-500">{item.talla} · {item.color}</p>
                                    </div>
                                    <Badge variante={item.stock === 0 ? 'error' : 'alerta'}>
                                        {item.stock === 0 ? 'Agotado' : `${item.stock} uds`}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VendedorDashboard