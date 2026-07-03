import { useNavigate } from 'react-router-dom'
import { usePedidos } from '../../hooks/usePedidos.js'
import { CabeceraSeccion } from '../../components/admin/CabeceraSeccion.jsx'
import { TablaBase } from '../../components/admin/TablaBase.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Paginacion } from '../../components/ui/Paginacion.jsx'
import { formatearMoneda, formatearFechaHora } from '../../utils/formato.js'
import { ESTADO_PEDIDO_COLOR, ESTADO_PEDIDO_ETIQUETA } from '../../utils/constantes.js'

const OPCIONES_ESTADO = [
    { valor: '', etiqueta: 'Todos los estados' },
    { valor: 'PENDIENTE', etiqueta: 'Pendiente' },
    { valor: 'CONFIRMADO', etiqueta: 'Confirmado' },
    { valor: 'ENVIADO', etiqueta: 'Enviado' },
    { valor: 'ENTREGADO', etiqueta: 'Entregado' },
    { valor: 'CANCELADO', etiqueta: 'Cancelado' },
]

const PedidosPage = () => {
    const navigate = useNavigate()
    const { datos, meta, cargando, filtros, aplicarFiltros, irAPagina } = usePedidos()

    const columnas = [
        {
            clave: 'id', titulo: 'Pedido',
            render: (p) => (
                <div>
                    <p className="font-medium text-neutral-900">#{p.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-neutral-400">{formatearFechaHora(p.creadoEn)}</p>
                </div>
            ),
        },
        {
            clave: 'cliente', titulo: 'Cliente',
            render: (p) => (
                <div>
                    <p className="text-sm text-neutral-800">{p.cliente?.nombre}</p>
                    <p className="text-xs text-neutral-400">{p.cliente?.correo}</p>
                </div>
            ),
        },
        { clave: 'items', titulo: 'Items', render: (p) => <span className="text-sm text-neutral-600">{p.items?.length ?? 0} productos</span> },
        { clave: 'estado', titulo: 'Estado', render: (p) => <Badge variante={ESTADO_PEDIDO_COLOR[p.estado] ?? 'default'}>{ESTADO_PEDIDO_ETIQUETA[p.estado] ?? p.estado}</Badge> },
        { clave: 'total', titulo: 'Total', render: (p) => <span className="font-semibold text-neutral-900">{formatearMoneda(p.total)}</span> },
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <CabeceraSeccion titulo="Pedidos" descripcion="Gestión de pedidos web" />
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-3 px-4 py-3 border-b border-neutral-100">
                    <Select opciones={OPCIONES_ESTADO} placeholder={null} value={filtros.estado || ''} onChange={(e) => aplicarFiltros({ estado: e.target.value || undefined })} className="sm:w-48" />
                    <div className="flex gap-2">
                        <Input type="date" value={filtros.fechaDesde || ''} onChange={(e) => aplicarFiltros({ fechaDesde: e.target.value || undefined })} />
                        <Input type="date" value={filtros.fechaHasta || ''} onChange={(e) => aplicarFiltros({ fechaHasta: e.target.value || undefined })} />
                    </div>
                </div>
                <TablaBase columnas={columnas} filas={datos ?? []} cargando={cargando} accionFila={(p) => navigate(`/admin/pedidos/${p.id}`)} />
                {meta && meta.totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-neutral-100">
                        <Paginacion meta={meta} onCambiarPagina={irAPagina} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PedidosPage