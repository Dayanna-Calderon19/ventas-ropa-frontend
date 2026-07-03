import { useParams, useNavigate } from 'react-router-dom'
import { RiArrowLeftLine, RiPrinterLine } from 'react-icons/ri'
import { useVenta } from '../../hooks/useVentas.js'
import { Boton } from '../../components/ui/Boton.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { formatearMoneda, formatearFechaHora } from '../../utils/formato.js'

const DetalleVentaPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { datos: venta, cargando, error } = useVenta(id)

    if (cargando) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner tamanio="lg" />
            </div>
        )
    }

    if (error || !venta) {
        return (
            <div className="p-6">
                <p className="text-sm text-neutral-500">Venta no encontrada.</p>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/vendedor/historial')}
                    className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                    <RiArrowLeftLine size={16} /> Volver
                </button>
                <Boton
                    variante="secundario"
                    tamanio="sm"
                    icono={<RiPrinterLine size={15} />}
                    onClick={() => window.print()}
                >
                    Imprimir
                </Boton>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden print:border-0 print:shadow-none">
                <div className="px-6 py-5 text-center border-b border-neutral-100">
                    <h1 className="text-lg font-bold text-neutral-900">COMPROBANTE DE VENTA</h1>
                    <p className="text-sm font-mono text-neutral-600 mt-1">
                        {venta.numeroComprobante ?? `#${venta.id.slice(0, 8).toUpperCase()}`}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">{formatearFechaHora(venta.creadoEn)}</p>
                </div>

                <div className="px-6 py-4 border-b border-neutral-100">
                    <p className="text-xs text-neutral-500">Vendedor</p>
                    <p className="text-sm font-medium text-neutral-900">{venta.vendedor?.nombre}</p>
                </div>

                <div className="px-6 py-4">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Productos</p>
                    <div className="flex flex-col gap-3">
                        {venta.items?.map((item) => (
                            <div key={item.id} className="flex justify-between gap-4 text-sm">
                                <div className="min-w-0">
                                    <p className="font-medium text-neutral-900 truncate">{item.variante?.producto?.nombre}</p>
                                    <p className="text-xs text-neutral-500">{item.variante?.talla} · {item.variante?.color}</p>
                                    <p className="text-xs text-neutral-400">{item.cantidad} × {formatearMoneda(item.precioUnitario)}</p>
                                </div>
                                <p className="font-semibold text-neutral-900 flex-shrink-0">
                                    {formatearMoneda(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Subtotal</span>
                            <span className="font-medium">{formatearMoneda(venta.subtotal)}</span>
                        </div>
                        {venta.descuento > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Descuento</span>
                                <span className="font-medium text-green-600">−{formatearMoneda(venta.descuento)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">IGV (18%)</span>
                            <span className="font-medium text-neutral-500">{formatearMoneda(venta.impuesto)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold pt-3 border-t border-neutral-300">
                            <span>TOTAL</span>
                            <span>{formatearMoneda(venta.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetalleVentaPage