import { Link } from 'react-router-dom'
import { RiFileListLine, RiArrowRightLine } from 'react-icons/ri'
import { usePedidos } from '../../hooks/usePedidos.js'
import { Paginacion } from '../../components/ui/Paginacion.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { EstadoVacio } from '../../components/ui/EstadoVacio.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { formatearFechaHora, formatearMoneda } from '../../utils/formato.js'
import { ESTADO_PEDIDO_COLOR, ESTADO_PEDIDO_ETIQUETA } from '../../utils/constantes.js'

const OPCIONES_ESTADO = [
    { valor: '', etiqueta: 'Todos los estados' },
    { valor: 'PENDIENTE', etiqueta: 'Pendiente' },
    { valor: 'CONFIRMADO', etiqueta: 'Confirmado' },
    { valor: 'ENVIADO', etiqueta: 'Enviado' },
    { valor: 'ENTREGADO', etiqueta: 'Entregado' },
    { valor: 'CANCELADO', etiqueta: 'Cancelado' },
]

const FilaPedido = ({ pedido }) => (
    <Link
        to={`/cliente/pedidos/${pedido.id}`}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
    >
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-900">
                    Pedido #{pedido.id.slice(0, 8).toUpperCase()}
                </span>
                <Badge variante={ESTADO_PEDIDO_COLOR[pedido.estado] ?? 'default'}>
                    {ESTADO_PEDIDO_ETIQUETA[pedido.estado] ?? pedido.estado}
                </Badge>
            </div>
            <span className="text-xs text-neutral-500">{formatearFechaHora(pedido.creadoEn)}</span>
            <span className="text-xs text-neutral-500">
                {pedido.items?.length} {pedido.items?.length === 1 ? 'producto' : 'productos'}
            </span>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-neutral-900">
                {formatearMoneda(pedido.total)}
            </span>
            <RiArrowRightLine size={16} className="text-neutral-400" />
        </div>
    </Link>
)

const SkeletonFila = () => (
    <div className="flex justify-between items-center p-4 border-b border-neutral-100">
        <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-20" />
    </div>
)

const MisPedidosPage = () => {
    const { datos, meta, cargando, filtros, irAPagina, aplicarFiltros } = usePedidos()

    const manejarEstado = (e) => {
        aplicarFiltros({ estado: e.target.value || undefined })
    }

    const pedidos = datos ?? []

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Mis pedidos</h1>
                <Select
                    opciones={OPCIONES_ESTADO}
                    placeholder={null}
                    value={filtros.estado || ''}
                    onChange={manejarEstado}
                    className="w-48"
                />
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                {cargando ? (
                    Array.from({ length: 5 }).map((_, i) => <SkeletonFila key={i} />)
                ) : pedidos.length === 0 ? (
                    <EstadoVacio
                        icono={<RiFileListLine size={40} className="text-neutral-300" />}
                        titulo="Sin pedidos"
                        descripcion="Aún no has realizado ningún pedido."
                        accion={
                            <Link
                                to="/catalogo"
                                className="text-sm font-medium text-neutral-900 underline hover:no-underline"
                            >
                                Ir al catálogo
                            </Link>
                        }
                    />
                ) : (
                    pedidos.map((p) => <FilaPedido key={p.id} pedido={p} />)
                )}
            </div>

            {meta && meta.totalPages > 1 && (
                <div className="mt-6">
                    <Paginacion meta={meta} onCambiarPagina={irAPagina} />
                </div>
            )}
        </div>
    )
}

export default MisPedidosPage