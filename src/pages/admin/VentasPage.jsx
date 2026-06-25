import { useNavigate } from 'react-router-dom'
import { RiEyeLine } from 'react-icons/ri'
import { useVentas } from '../../hooks/useVentas.js'
import { CabeceraSeccion } from '../../components/admin/CabeceraSeccion.jsx'
import { TablaBase } from '../../components/admin/TablaBase.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Paginacion } from '../../components/ui/Paginacion.jsx'
import { formatearMoneda, formatearFechaHora } from '../../utils/formato.js'

const OPCIONES_CANAL = [
    { valor: '', etiqueta: 'Todos los canales' },
    { valor: 'TIENDA', etiqueta: 'Tienda' },
    { valor: 'WEB', etiqueta: 'Web' },
]

const VentasPage = () => {
    const navigate = useNavigate()
    const { datos, meta, cargando, filtros, aplicarFiltros, irAPagina } = useVentas()

    const columnas = [
        {
            clave: 'numeroComprobante', titulo: 'Comprobante',
            render: (v) => (
                <div>
                    <p className="font-medium text-neutral-900">{v.numeroComprobante ?? `#${v.id.slice(0, 8).toUpperCase()}`}</p>
                    <p className="text-xs text-neutral-400">{formatearFechaHora(v.creadoEn)}</p>
                </div>
            ),
        },
        { clave: 'vendedor', titulo: 'Vendedor', render: (v) => <span className="text-sm text-neutral-700">{v.vendedor?.nombre ?? '—'}</span> },
        { clave: 'canal', titulo: 'Canal', render: (v) => <Badge variante={v.canal === 'WEB' ? 'info' : 'default'}>{v.canal === 'WEB' ? 'Web' : 'Tienda'}</Badge> },
        { clave: 'items', titulo: 'Productos', render: (v) => <span className="text-sm text-neutral-600">{v.items?.length ?? 0} items</span> },
        { clave: 'total', titulo: 'Total', render: (v) => <span className="font-semibold text-neutral-900">{formatearMoneda(v.total)}</span> },
        {
            clave: 'acciones', titulo: '',
            render: (v) => (
                <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/ventas/${v.id}`) }} className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
                    <RiEyeLine size={15} />
                </button>
            ),
        },
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <CabeceraSeccion titulo="Ventas" descripcion="Historial de todas las transacciones" />
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-3 px-4 py-3 border-b border-neutral-100">
                    <Select opciones={OPCIONES_CANAL} placeholder={null} value={filtros.canal || ''} onChange={(e) => aplicarFiltros({ canal: e.target.value || undefined })} className="sm:w-44" />
                    <div className="flex gap-2">
                        <Input type="date" value={filtros.fechaDesde || ''} onChange={(e) => aplicarFiltros({ fechaDesde: e.target.value || undefined })} />
                        <Input type="date" value={filtros.fechaHasta || ''} onChange={(e) => aplicarFiltros({ fechaHasta: e.target.value || undefined })} />
                    </div>
                </div>
                <TablaBase columnas={columnas} filas={datos ?? []} cargando={cargando} accionFila={(v) => navigate(`/admin/ventas/${v.id}`)} />
                {meta && meta.totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-neutral-100">
                        <Paginacion meta={meta} onCambiarPagina={irAPagina} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default VentasPage