import { useNavigate } from 'react-router-dom'
import { RiEyeLine } from 'react-icons/ri'
import { useAuth } from '../../hooks/useAuth.js'
import { useVentas } from '../../hooks/useVentas.js'
import { CabeceraSeccion } from '../../components/admin/CabeceraSeccion.jsx'
import { TablaBase } from '../../components/admin/TablaBase.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Paginacion } from '../../components/ui/Paginacion.jsx'
import { formatearMoneda, formatearFechaHora } from '../../utils/formato.js'

const HistorialVentasPage = () => {
    const navigate = useNavigate()
    const { usuario } = useAuth()
    const { datos, meta, cargando, filtros, aplicarFiltros, irAPagina } = useVentas({
        vendedorId: usuario?.id,
    })

    const columnas = [
        {
            clave: 'numeroComprobante', titulo: 'Comprobante',
            render: (v) => (
                <div>
                    <p className="font-medium text-neutral-900">
                        {v.numeroComprobante ?? `#${v.id.slice(0, 8).toUpperCase()}`}
                    </p>
                    <p className="text-xs text-neutral-400">{formatearFechaHora(v.creadoEn)}</p>
                </div>
            ),
        },
        {
            clave: 'items', titulo: 'Productos',
            render: (v) => <span className="text-sm text-neutral-600">{v.items?.length ?? 0} items</span>,
        },
        {
            clave: 'total', titulo: 'Total',
            render: (v) => <span className="font-semibold text-neutral-900">{formatearMoneda(v.total)}</span>,
        },
        {
            clave: 'acciones', titulo: 'Acciones',
            render: (v) => (
                <button
                    onClick={() => navigate(`/vendedor/ventas/${v.id}`)}
                    className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                    title="Ver detalle"
                >
                    <RiEyeLine size={16} />
                </button>
            ),
        },
    ]

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <CabeceraSeccion titulo="Historial de ventas" descripcion="Todas tus ventas registradas" />

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <div className="flex gap-3 px-4 py-3 border-b border-neutral-100">
                    <Input
                        type="date"
                        value={filtros.fechaDesde || ''}
                        onChange={(e) => aplicarFiltros({ fechaDesde: e.target.value || undefined })}
                    />
                    <Input
                        type="date"
                        value={filtros.fechaHasta || ''}
                        onChange={(e) => aplicarFiltros({ fechaHasta: e.target.value || undefined })}
                    />
                </div>

                <TablaBase
                    columnas={columnas}
                    filas={datos ?? []}
                    cargando={cargando}
                />

                {meta && meta.totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-neutral-100">
                        <Paginacion meta={meta} onCambiarPagina={irAPagina} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default HistorialVentasPage