import { useParams, useNavigate, Link } from 'react-router-dom'
import { RiArrowLeftLine, RiMapPinLine, RiTimeLine } from 'react-icons/ri'
import { usePedido, useMutacionPedido } from '../../hooks/usePedidos.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { ResumenCarrito } from '../../components/carrito/ResumenCarrito.jsx'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { EstadoVacio } from '../../components/ui/EstadoVacio.jsx'
import { useModal } from '../../hooks/useModal.js'
import { formatearFechaHora, formatearMoneda } from '../../utils/formato.js'
import { ESTADO_PEDIDO_COLOR, ESTADO_PEDIDO_ETIQUETA } from '../../utils/constantes.js'

const PASOS_ESTADO = ['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO']

const LineaTiempo = ({ estado }) => {
    const indexActual = PASOS_ESTADO.indexOf(estado)
    const cancelado = estado === 'CANCELADO'

    if (cancelado) {
        return (
            <div className="flex items-center gap-2 py-3">
                <Badge variante="error">Cancelado</Badge>
                <span className="text-sm text-neutral-500">Este pedido fue cancelado</span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-0">
            {PASOS_ESTADO.map((paso, i) => {
                const completado = i <= indexActual
                const esActual = i === indexActual
                return (
                    <div key={paso} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${completado
                                        ? 'bg-neutral-900 border-neutral-900 text-white'
                                        : 'border-neutral-300 text-neutral-400'
                                    }`}
                            >
                                {completado ? '✓' : i + 1}
                            </div>
                            <span
                                className={`text-[10px] text-center leading-tight w-16 ${esActual ? 'font-semibold text-neutral-900' : 'text-neutral-400'
                                    }`}
                            >
                                {ESTADO_PEDIDO_ETIQUETA[paso]}
                            </span>
                        </div>
                        {i < PASOS_ESTADO.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mb-5 mx-1 transition-colors ${i < indexActual ? 'bg-neutral-900' : 'bg-neutral-200'
                                    }`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

const DetallePedidoPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { exito } = useToast()
    const modalCancelar = useModal('cliente_pedido_cancelar')

    const { datos: pedido, cargando, error, cargar } = usePedido(id)
    const { cancelar, cargando: cancelando } = useMutacionPedido()

    const manejarCancelar = async () => {
        await cancelar(id)
        exito('Pedido cancelado correctamente')
        modalCancelar.cerrar()
        cargar()
    }

    if (cargando) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner tamanio="lg" />
            </div>
        )
    }

    if (error || !pedido) {
        return (
            <EstadoVacio
                titulo="Pedido no encontrado"
                descripcion="No se pudo cargar la información de este pedido."
                accion={
                    <Boton variante="primario" onClick={() => navigate('/cliente/pedidos')}>
                        Mis pedidos
                    </Boton>
                }
            />
        )
    }

    const puedeCanelarse = pedido.estado === 'PENDIENTE'

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <button
                onClick={() => navigate('/cliente/pedidos')}
                className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-6"
            >
                <RiArrowLeftLine size={16} />
                Mis pedidos
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-neutral-900">
                        Pedido #{pedido.id.slice(0, 8).toUpperCase()}
                    </h1>
                    <p className="text-sm text-neutral-500 mt-0.5">
                        {formatearFechaHora(pedido.creadoEn)}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variante={ESTADO_PEDIDO_COLOR[pedido.estado] ?? 'default'}>
                        {ESTADO_PEDIDO_ETIQUETA[pedido.estado] ?? pedido.estado}
                    </Badge>
                    {puedeCanelarse && (
                        <Boton variante="peligro" tamanio="sm" onClick={modalCancelar.abrir}>
                            Cancelar pedido
                        </Boton>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <div className="bg-white border border-neutral-200 rounded-lg p-5">
                        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Estado del pedido</h2>
                        <LineaTiempo estado={pedido.estado} />
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-lg p-5">
                        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Productos</h2>
                        <div className="flex flex-col divide-y divide-neutral-100">
                            {pedido.items?.map((item) => (
                                <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                                    <div className="w-14 h-16 bg-neutral-100 rounded flex-shrink-0 overflow-hidden">
                                        {item.variante?.producto?.imagenUrl ? (
                                            <img
                                                src={item.variante.producto.imagenUrl}
                                                alt={item.variante.producto.nombre}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-200" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate">
                                            {item.variante?.producto?.nombre}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {item.variante?.talla} · {item.variante?.color}
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            {item.cantidad} × {formatearMoneda(item.precioUnitario)}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-neutral-900 flex-shrink-0">
                                        {formatearMoneda(item.subtotal)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {pedido.direccionEnvio && (
                        <div className="bg-white border border-neutral-200 rounded-lg p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <RiMapPinLine size={16} className="text-neutral-500" />
                                <h2 className="text-sm font-semibold text-neutral-900">Dirección de envío</h2>
                            </div>
                            <p className="text-sm text-neutral-600">{pedido.direccionEnvio}</p>
                        </div>
                    )}

                    {pedido.historialEstados?.length > 0 && (
                        <div className="bg-white border border-neutral-200 rounded-lg p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <RiTimeLine size={16} className="text-neutral-500" />
                                <h2 className="text-sm font-semibold text-neutral-900">Historial</h2>
                            </div>
                            <div className="flex flex-col gap-3">
                                {pedido.historialEstados.map((h) => (
                                    <div key={h.id} className="flex gap-3 items-start">
                                        <div className="w-2 h-2 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-neutral-900">
                                                {ESTADO_PEDIDO_ETIQUETA[h.estado] ?? h.estado}
                                            </p>
                                            {h.nota && (
                                                <p className="text-xs text-neutral-500">{h.nota}</p>
                                            )}
                                            <p className="text-xs text-neutral-400">{formatearFechaHora(h.cambiadoEn)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-5 h-fit">
                    <h2 className="text-sm font-semibold text-neutral-900 mb-4">Resumen</h2>
                    <ResumenCarrito
                        subtotal={pedido.subtotal}
                        descuento={pedido.descuento}
                        costoEnvio={pedido.costoEnvio}
                    />
                    {pedido.notas && (
                        <div className="mt-4 pt-4 border-t border-neutral-100">
                            <p className="text-xs text-neutral-500 font-medium mb-1">Notas</p>
                            <p className="text-xs text-neutral-600">{pedido.notas}</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                abierto={modalCancelar.abierto}
                titulo="Cancelar pedido"
                mensaje="¿Estás seguro de que quieres cancelar este pedido? El stock será devuelto automáticamente."
                textoConfirmar="Sí, cancelar pedido"
                cargando={cancelando}
                onCancelar={modalCancelar.cerrar}
                onConfirmar={manejarCancelar}
            />
        </div>
    )
}

export default DetallePedidoPage