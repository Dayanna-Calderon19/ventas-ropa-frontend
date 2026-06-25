import { useEffect } from 'react'
import { RiSearchLine, RiAlertLine, RiErrorWarningLine, RiImageLine } from 'react-icons/ri'
import { useVariantes } from '../../hooks/useInventario.js'
import { useBusqueda } from '../../hooks/useBusqueda.js'
import { CabeceraSeccion } from '../../components/admin/CabeceraSeccion.jsx'
import { TablaBase } from '../../components/admin/TablaBase.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Paginacion } from '../../components/ui/Paginacion.jsx'
import { formatearMoneda } from '../../utils/formato.js'

const PanelError = ({ mensaje, onReintentar }) => (
    <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
        <RiErrorWarningLine size={22} className="text-red-400" />
        <p className="text-sm text-neutral-500">{mensaje ?? 'No se pudo cargar el inventario'}</p>
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

const InventarioVendedorPage = () => {
    const { termino, terminoRetrasado, manejarCambio: manejarBusqueda } = useBusqueda()
    const { datos, meta, cargando, error, filtros, aplicarFiltros, irAPagina, cargar } = useVariantes()

    useEffect(() => {
        aplicarFiltros({ busqueda: terminoRetrasado || undefined })
    }, [terminoRetrasado])

    const filas = datos ?? []
    const agotadosEnPagina = filas.filter((v) => v.stock === 0).length
    const bajosEnPagina = filas.filter((v) => v.stock > 0 && v.stock <= 5).length

    const columnas = [
        {
            clave: 'producto',
            titulo: 'Producto',
            render: (v) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-neutral-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {v.producto?.imagenUrl ? (
                            <img
                                src={v.producto.imagenUrl}
                                alt={v.producto.nombre}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <RiImageLine size={16} className="text-neutral-300" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-neutral-900 truncate">{v.producto?.nombre}</p>
                        <p className="text-xs text-neutral-400">SKU: {v.sku}</p>
                    </div>
                </div>
            ),
        },
        {
            clave: 'talla',
            titulo: 'Talla',
            render: (v) => <span className="text-sm">{v.talla}</span>,
        },
        {
            clave: 'color',
            titulo: 'Color',
            render: (v) => <span className="text-sm">{v.color}</span>,
        },
        {
            clave: 'precio',
            titulo: 'Precio',
            render: (v) => <span className="text-sm font-medium">{formatearMoneda(v.precio)}</span>,
        },
        {
            clave: 'stock',
            titulo: 'Stock',
            render: (v) => (
                <div className="flex items-center gap-2">
                    <span className={`font-semibold ${v.stock === 0 ? 'text-red-600' : v.stock <= 5 ? 'text-orange-600' : 'text-neutral-900'}`}>
                        {v.stock}
                    </span>
                    {v.stock === 0 && <Badge variante="error">Agotado</Badge>}
                    {v.stock > 0 && v.stock <= 5 && <Badge variante="alerta">Bajo</Badge>}
                </div>
            ),
        },
    ]

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <CabeceraSeccion
                titulo="Inventario"
                descripcion="Consulta de stock disponible (solo lectura)"
            />

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-neutral-100">
                    <div className="flex-1">
                        <Input
                            type="text"
                            value={termino}
                            onChange={manejarBusqueda}
                            placeholder="Buscar por producto, SKU..."
                            icono={<RiSearchLine size={15} />}
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer whitespace-nowrap">
                        <input
                            type="checkbox"
                            checked={filtros.stockBajo === 'true'}
                            onChange={(e) => aplicarFiltros({ stockBajo: e.target.checked ? 'true' : undefined })}
                            className="rounded"
                        />
                        <RiAlertLine size={15} className="text-orange-500" />
                        Solo stock bajo o agotado
                    </label>
                </div>

                {!error && !cargando && filas.length > 0 && (agotadosEnPagina > 0 || bajosEnPagina > 0) && (
                    <div className="flex items-center gap-4 px-4 py-2.5 bg-orange-50 border-b border-orange-100 text-xs">
                        {agotadosEnPagina > 0 && (
                            <span className="flex items-center gap-1.5 text-red-700 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {agotadosEnPagina} agotado{agotadosEnPagina === 1 ? '' : 's'} en esta página
                            </span>
                        )}
                        {bajosEnPagina > 0 && (
                            <span className="flex items-center gap-1.5 text-orange-700 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                {bajosEnPagina} con stock bajo
                            </span>
                        )}
                    </div>
                )}

                {error ? (
                    <PanelError mensaje={error} onReintentar={cargar} />
                ) : (
                    <TablaBase columnas={columnas} filas={filas} cargando={cargando} />
                )}

                {meta && meta.totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-neutral-100">
                        <Paginacion meta={meta} onCambiarPagina={irAPagina} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default InventarioVendedorPage