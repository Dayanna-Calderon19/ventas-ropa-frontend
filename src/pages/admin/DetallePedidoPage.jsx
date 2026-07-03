import { useParams, useNavigate } from 'react-router-dom'
import { RiArrowLeftLine, RiMapPinLine, RiTimeLine } from 'react-icons/ri'
import { usePedido, useMutacionPedido } from '../../hooks/usePedidos.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { ResumenCarrito } from '../../components/carrito/ResumenCarrito.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { EstadoVacio } from '../../components/ui/EstadoVacio.jsx'
import { formatearFechaHora, formatearMoneda } from '../../utils/formato.js'
import { ESTADO_PEDIDO_COLOR, ESTADO_PEDIDO_ETIQUETA } from '../../utils/constantes.js'
import { useState } from 'react'

const PASOS_ESTADO = ['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO']

const OPCIONES_ESTADO = PASOS_ESTADO.map(e => ({ valor: e, etiqueta: ESTADO_PEDIDO_ETIQUETA[e] ?? e }))

const DetallePedidoPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { exito, error: mostrarError } = useToast()
    const [nuevoEstado, setNuevoEstado] = useState('')

    const { datos: pedido, cargando, error, cargar } = usePedido(id)
    const { actualizarEstado, cargando: actualizando } = useMutacionPedido()

    const manejarActualizarEstado = async () => {
        if (!nuevoEstado) return
        try {
            await actualizarEstado(id, { estado: nuevoEstado })
            exito('Estado actualizado correctamente')
            setNuevoEstado('')
            cargar()
        } catch (err) {
            mostrarError(err.message || 'Error al actualizar estado')
        }
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
                    <Boton variante="primario" onClick={() => navigate('/admin/pedidos')}>
                        Volver a pedidos
                    </Boton>
                }
            />
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <button
                onClick={() => navigate('/admin/pedidos')}
                className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-6"
            >
                <RiArrowLeftLine size={16} />
                Volver a pedidos
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
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <div className="bg-white border border-neutral-200 rounded-lg p-5">
                        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Actualizar estado</h2>
                        <div className="flex gap-2">
                            <Select 
                                opciones={OPCIONES_ESTADO} 
                                value={nuevoEstado} 
                                onChange={(e) => setNuevoEstado(e.target.value)} 
                                className="flex-1"
                            />
                            <Boton onClick={manejarActualizarEstado} cargando={actualizando} disabled={!nuevoEstado || nuevoEstado === pedido.estado}>
                                Actualizar
                            </Boton>
                        </div>
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
        </div>
    )
}

export default DetallePedidoPage