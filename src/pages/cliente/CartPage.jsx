import { Link, useNavigate } from 'react-router-dom'
import { RiShoppingBagLine, RiArrowRightLine, RiDeleteBinLine, RiCouponLine } from 'react-icons/ri'
import { useCarrito } from '../../hooks/useCarrito.js'
import { ItemCarrito } from '../../components/carrito/ItemCarrito.jsx'
import { ResumenCarrito } from '../../components/carrito/ResumenCarrito.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { EstadoVacio } from '../../components/ui/EstadoVacio.jsx'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx'
import { useModal } from '../../hooks/useModal.js'
import { useState, useEffect } from 'react'
import { listarPromociones } from '../../services/promocion.service.js'
import { useToast } from '../../components/ui/Toast.jsx'

const CartPage = () => {
    const { items, subtotal, cantidadItems, limpiarCarrito, aplicarPromocion, quitarPromocion, promocion } = useCarrito()
    const navigate = useNavigate()
    const modalLimpiar = useModal('cliente_cart_limpiar')
    const [promosVigentes, setPromosVigentes] = useState([])
    const { exito, error: mostrarError } = useToast()

    useEffect(() => {
        const fetchPromos = async () => {
            const response = await listarPromociones({ activo: 'true' })
            setPromosVigentes(response.data || [])
        }
        fetchPromos()
    }, [])

    const manejarAplicarPromo = async (promoSeleccionada) => {
        try {
            let promoParaAplicar = promoSeleccionada;
            
            if (typeof promoSeleccionada === 'string') {
                const response = await listarPromociones({ codigo: promoSeleccionada, activo: 'true' })
                if (response.data && response.data.length > 0) {
                    promoParaAplicar = response.data[0];
                } else {
                    mostrarError('Código no válido o no activo')
                    return;
                }
            }
            
            if (promoParaAplicar) {
                if (promoParaAplicar.montoMinimo && subtotal < promoParaAplicar.montoMinimo) {
                    mostrarError(`Esta promoción requiere un mínimo de compra de ${promoParaAplicar.montoMinimo}`)
                    return;
                }
                
                aplicarPromocion(promoParaAplicar)
                exito('Promoción aplicada')
            }
        } catch (err) {
            console.error(err);
            mostrarError('Error al validar código')
        }
    }

    if (!items.length) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <EstadoVacio
                    icono={<RiShoppingBagLine size={48} className="text-neutral-300" />}
                    titulo="Tu carrito está vacío"
                    descripcion="Agrega productos desde el catálogo para comenzar tu compra."
                    accion={
                        <Boton variante="primario" onClick={() => navigate('/catalogo')}>
                            Ir al catálogo
                        </Boton>
                    }
                />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">
                    Carrito
                    <span className="ml-2 text-base font-normal text-neutral-500">
                        ({cantidadItems} {cantidadItems === 1 ? 'producto' : 'productos'})
                    </span>
                </h1>
                <button
                    onClick={modalLimpiar.abrir}
                    className="flex items-center gap-1 text-sm text-neutral-400 hover:text-red-500 transition-colors"
                >
                    <RiDeleteBinLine size={15} />
                    Vaciar
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-lg px-4 py-2">
                    {items.map((item) => (
                        <ItemCarrito key={item.varianteId} item={item} />
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-white border border-neutral-200 rounded-lg p-5">
                        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Resumen del pedido</h2>
                        <ResumenCarrito 
                            subtotal={subtotal} 
                            promocion={promocion}
                            promosVigentes={promosVigentes}
                            onAplicarPromo={manejarAplicarPromo}
                            onQuitarPromo={quitarPromocion}
                        />
                        <Boton
                            variante="primario"
                            tamanio="lg"
                            ancho
                            icono={<RiArrowRightLine size={18} />}
                            iconoDerecha
                            onClick={() => navigate('/cliente/checkout')}
                            className="mt-5"
                        >
                            Continuar compra
                        </Boton>
                    </div>

                    <Link
                        to="/catalogo"
                        className="text-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                        Seguir comprando
                    </Link>
                </div>
            </div>

            <ConfirmDialog
                abierto={modalLimpiar.abierto}
                titulo="Vaciar carrito"
                mensaje="¿Estás seguro de que quieres eliminar todos los productos del carrito?"
                textoConfirmar="Vaciar carrito"
                onCancelar={modalLimpiar.cerrar}
                onConfirmar={() => {
                    limpiarCarrito()
                    modalLimpiar.cerrar()
                }}
            />
        </div>
    )
}

export default CartPage
