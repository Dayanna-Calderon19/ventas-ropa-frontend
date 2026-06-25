import { useNavigate } from 'react-router-dom'
import { RiMapPinLine, RiShoppingBagLine } from 'react-icons/ri'
import { useCarrito } from '../../hooks/useCarrito.js'
import { useMutacionPedido } from '../../hooks/usePedidos.js'
import { useFormulario } from '../../hooks/useFormulario.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { ResumenCarrito } from '../../components/carrito/ResumenCarrito.jsx'
import { ItemCarrito } from '../../components/carrito/ItemCarrito.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Alerta } from '../../components/ui/Alerta.jsx'
import { EstadoVacio } from '../../components/ui/EstadoVacio.jsx'

const validarDireccion = ({ direccion, ciudad, distrito }) => {
    const errores = {}
    if (!direccion?.trim()) errores.direccion = 'La dirección es requerida'
    if (!ciudad?.trim()) errores.ciudad = 'La ciudad es requerida'
    if (!distrito?.trim()) errores.distrito = 'El distrito es requerido'
    return errores
}

const VALORES_INICIALES = { direccion: '', ciudad: '', distrito: '', referencia: '', notas: '' }

const CheckoutPage = () => {
    const navigate = useNavigate()
    const { items, subtotal, itemsParaPedido, limpiarCarrito } = useCarrito()
    const { crear, cargando, error } = useMutacionPedido()
    const { exito } = useToast()

    const { valores, errores, errorGlobal, manejarCambio, manejarEnvio } =
        useFormulario(VALORES_INICIALES, validarDireccion)

    if (!items.length) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <EstadoVacio
                    icono={<RiShoppingBagLine size={48} className="text-neutral-300" />}
                    titulo="No hay productos en tu carrito"
                    descripcion="Agrega productos antes de continuar con el pago."
                    accion={
                        <Boton variante="primario" onClick={() => navigate('/catalogo')}>
                            Ir al catálogo
                        </Boton>
                    }
                />
            </div>
        )
    }

    const manejarSubmit = async (e) => {
        e.preventDefault()
        await manejarEnvio(async (datos) => {
            const direccionEnvio = `${datos.direccion}, ${datos.distrito}, ${datos.ciudad}${datos.referencia ? ` (Ref: ${datos.referencia})` : ''}`
            const pedido = await crear({
                items: itemsParaPedido,
                direccionEnvio,
                notas: datos.notas || undefined,
            })
            limpiarCarrito()
            exito('Pedido realizado correctamente')
            navigate(`/cliente/pedidos/${pedido.id}`)
        })
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-neutral-900 mb-8">Finalizar compra</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={manejarSubmit} className="lg:col-span-2 flex flex-col gap-6" noValidate>
                    {(errorGlobal || error) && (
                        <Alerta tipo="error" mensaje={errorGlobal || error} />
                    )}

                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <RiMapPinLine size={18} className="text-neutral-500" />
                            <h2 className="text-base font-semibold text-neutral-900">Dirección de envío</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Dirección"
                                name="direccion"
                                value={valores.direccion}
                                onChange={manejarCambio}
                                error={errores.direccion}
                                placeholder="Av. Principal 123"
                                requerido
                                className="sm:col-span-2"
                            />
                            <Input
                                label="Ciudad"
                                name="ciudad"
                                value={valores.ciudad}
                                onChange={manejarCambio}
                                error={errores.ciudad}
                                placeholder="Lima"
                                requerido
                            />
                            <Input
                                label="Distrito"
                                name="distrito"
                                value={valores.distrito}
                                onChange={manejarCambio}
                                error={errores.distrito}
                                placeholder="Miraflores"
                                requerido
                            />
                            <Input
                                label="Referencia"
                                name="referencia"
                                value={valores.referencia}
                                onChange={manejarCambio}
                                placeholder="Cerca al parque..."
                                className="sm:col-span-2"
                            />
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h2 className="text-base font-semibold text-neutral-900 mb-5">Productos</h2>
                        <div className="divide-y divide-neutral-100">
                            {items.map((item) => (
                                <ItemCarrito key={item.varianteId} item={item} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h2 className="text-base font-semibold text-neutral-900 mb-3">Notas del pedido</h2>
                        <textarea
                            name="notas"
                            value={valores.notas}
                            onChange={manejarCambio}
                            placeholder="Instrucciones adicionales para tu pedido..."
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none placeholder-neutral-400"
                        />
                    </div>

                    <Boton
                        type="submit"
                        variante="primario"
                        tamanio="lg"
                        ancho
                        cargando={cargando}
                    >
                        Confirmar pedido
                    </Boton>
                </form>

                <div className="bg-white border border-neutral-200 rounded-lg p-5 h-fit sticky top-24">
                    <h2 className="text-sm font-semibold text-neutral-900 mb-4">Resumen</h2>
                    <ResumenCarrito subtotal={subtotal} />
                    <p className="text-xs text-neutral-400 mt-4 text-center">
                        El pago se realiza contra entrega
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage