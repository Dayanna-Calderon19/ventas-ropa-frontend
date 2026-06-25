import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiSearchLine, RiAddLine, RiDeleteBinLine, RiShoppingCartLine } from 'react-icons/ri'
import { useMutacionVenta } from '../../hooks/useVentas.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { useFetch } from '../../hooks/useFetch.js'
import { useBusqueda } from '../../hooks/useBusqueda.js'
import { Input } from '../../components/ui/Input.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { EstadoVacio } from '../../components/ui/EstadoVacio.jsx'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx'
import { useModal } from '../../hooks/useModal.js'
import { listarProductos } from '../../services/producto.service.js'
import { formatearMoneda } from '../../utils/formato.js'

const BuscadorProductos = ({ onAgregarVariante }) => {
    const { termino, terminoRetrasado, manejarCambio } = useBusqueda(300)
    const [productoExpandido, setProductoExpandido] = useState(null)

    const { datos, cargando } = useFetch(
        () => listarProductos({ busqueda: terminoRetrasado, limit: 8, activo: 'true' }),
        [terminoRetrasado],
        { ejecutarInmediatamente: !!terminoRetrasado, datosIniciales: null }
    )

    const productos = datos ?? []

    return (
        <div className="flex flex-col gap-3">
            <Input
                type="text"
                value={termino}
                onChange={manejarCambio}
                placeholder="Buscar producto por nombre..."
                icono={<RiSearchLine size={15} />}
            />

            {terminoRetrasado && (
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                    {cargando ? (
                        <div className="px-4 py-3 text-sm text-neutral-400">Buscando...</div>
                    ) : !productos.length ? (
                        <div className="px-4 py-3 text-sm text-neutral-400">Sin resultados</div>
                    ) : (
                        <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto">
                            {productos.map((p) => {
                                const variantesActivas = p.variantes?.filter((v) => v.activo && v.stock > 0) ?? []
                                const expandido = productoExpandido === p.id

                                return (
                                    <div key={p.id}>
                                        <button
                                            onClick={() => setProductoExpandido(expandido ? null : p.id)}
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-10 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                                                    {p.imagenUrl
                                                        ? <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-cover" />
                                                        : <div className="w-full h-full bg-neutral-200" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-neutral-900 truncate">{p.nombre}</p>
                                                    <p className="text-xs text-neutral-400">{variantesActivas.length} variantes disponibles</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-neutral-400 flex-shrink-0 ml-2">
                                                {expandido ? '▲' : '▼'}
                                            </span>
                                        </button>

                                        {expandido && variantesActivas.length > 0 && (
                                            <div className="bg-neutral-50 border-t border-neutral-100">
                                                {variantesActivas.map((v) => (
                                                    <div key={v.id} className="flex items-center justify-between px-6 py-2.5 border-b border-neutral-100 last:border-0">
                                                        <div>
                                                            <p className="text-sm text-neutral-800">{v.talla} · {v.color}</p>
                                                            <p className="text-xs text-neutral-500">Stock: {v.stock} · {formatearMoneda(v.precio)}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => onAgregarVariante({ ...v, producto: p })}
                                                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-neutral-900 text-white rounded hover:bg-neutral-700 transition-colors"
                                                        >
                                                            <RiAddLine size={13} /> Agregar
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {expandido && !variantesActivas.length && (
                                            <div className="px-6 py-3 text-xs text-neutral-400 bg-neutral-50 border-t border-neutral-100">
                                                Sin stock disponible
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const NuevaVentaPage = () => {
    const navigate = useNavigate()
    const { exito, error: toastError } = useToast()
    const { registrar, cargando } = useMutacionVenta()
    const modalConfirm = useModal()

    const [items, setItems] = useState([])

    const agregarVariante = useCallback((variante) => {
        setItems((prev) => {
            const existe = prev.find((i) => i.varianteId === variante.id)
            if (existe) {
                if (existe.cantidad >= variante.stock) {
                    toastError(`Stock máximo para esta variante: ${variante.stock}`)
                    return prev
                }
                return prev.map((i) =>
                    i.varianteId === variante.id ? { ...i, cantidad: i.cantidad + 1 } : i
                )
            }
            return [
                ...prev,
                {
                    varianteId: variante.id,
                    sku: variante.sku,
                    talla: variante.talla,
                    color: variante.color,
                    precio: variante.precio,
                    stock: variante.stock,
                    nombreProducto: variante.producto?.nombre ?? '',
                    imagenUrl: variante.producto?.imagenUrl ?? null,
                    cantidad: 1,
                },
            ]
        })
    }, [toastError])

    const cambiarCantidad = (varianteId, cantidad) => {
        if (cantidad <= 0) {
            setItems((prev) => prev.filter((i) => i.varianteId !== varianteId))
            return
        }
        setItems((prev) =>
            prev.map((i) => {
                if (i.varianteId !== varianteId) return i
                const nueva = Math.min(cantidad, i.stock)
                return { ...i, cantidad: nueva }
            })
        )
    }

    const quitarItem = (varianteId) => {
        setItems((prev) => prev.filter((i) => i.varianteId !== varianteId))
    }

    const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
    const impuesto = parseFloat((subtotal * 0.18).toFixed(2))
    const total = parseFloat((subtotal + impuesto).toFixed(2))

    const manejarRegistrar = async () => {
        try {
            const payload = {
                items: items.map(({ varianteId, cantidad }) => ({ varianteId, cantidad })),
            }
            const venta = await registrar(payload)
            exito('Venta registrada correctamente')
            setItems([])
            modalConfirm.cerrar()
            navigate(`/vendedor/historial/${venta.id}`)
        } catch {
            modalConfirm.cerrar()
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-xl font-bold text-neutral-900 mb-6">Nueva venta</h1>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 flex flex-col gap-5">
                    <div className="bg-white border border-neutral-200 rounded-lg p-5">
                        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Buscar productos</h2>
                        <BuscadorProductos onAgregarVariante={agregarVariante} />
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-neutral-900">
                                Items
                                {items.length > 0 && (
                                    <span className="ml-2 text-xs font-normal text-neutral-400">({items.length})</span>
                                )}
                            </h2>
                            {items.length > 0 && (
                                <button
                                    onClick={() => setItems([])}
                                    className="text-xs text-red-500 hover:text-red-700 transition-colors"
                                >
                                    Limpiar todo
                                </button>
                            )}
                        </div>

                        {!items.length ? (
                            <EstadoVacio
                                icono={<RiShoppingCartLine size={36} className="text-neutral-300" />}
                                titulo="Sin productos"
                                descripcion="Busca y agrega productos desde el buscador"
                            />
                        ) : (
                            <div className="divide-y divide-neutral-100">
                                {items.map((item) => (
                                    <div key={item.varianteId} className="flex gap-4 px-5 py-3">
                                        <div className="w-10 h-12 bg-neutral-100 rounded flex-shrink-0 overflow-hidden">
                                            {item.imagenUrl
                                                ? <img src={item.imagenUrl} alt="" className="w-full h-full object-cover" />
                                                : <div className="w-full h-full bg-neutral-200" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-900 truncate">{item.nombreProducto}</p>
                                            <p className="text-xs text-neutral-500">{item.talla} · {item.color}</p>
                                            <p className="text-xs font-semibold text-neutral-900 mt-0.5">
                                                {formatearMoneda(item.precio)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => cambiarCantidad(item.varianteId, item.cantidad - 1)}
                                                className="w-7 h-7 border border-neutral-300 rounded text-sm hover:border-neutral-900 transition-colors"
                                            >−</button>
                                            <span className="w-6 text-center text-sm font-medium">{item.cantidad}</span>
                                            <button
                                                onClick={() => cambiarCantidad(item.varianteId, item.cantidad + 1)}
                                                disabled={item.cantidad >= item.stock}
                                                className="w-7 h-7 border border-neutral-300 rounded text-sm hover:border-neutral-900 disabled:opacity-40 transition-colors"
                                            >+</button>
                                            <button
                                                onClick={() => quitarItem(item.varianteId)}
                                                className="ml-1 text-neutral-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <RiDeleteBinLine size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white border border-neutral-200 rounded-lg p-5 sticky top-6">
                        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Resumen</h2>

                        <div className="flex flex-col gap-2 mb-5">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Subtotal</span>
                                <span className="font-medium">{formatearMoneda(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">IGV (18%)</span>
                                <span className="font-medium text-neutral-500">{formatearMoneda(impuesto)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold pt-3 border-t border-neutral-200">
                                <span>Total</span>
                                <span>{formatearMoneda(total)}</span>
                            </div>
                        </div>

                        <Boton
                            variante="primario"
                            tamanio="lg"
                            ancho
                            disabled={!items.length}
                            onClick={modalConfirm.abrir}
                        >
                            Registrar venta
                        </Boton>

                        {!items.length && (
                            <p className="text-xs text-neutral-400 text-center mt-3">
                                Agrega productos para continuar
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                abierto={modalConfirm.abierto}
                titulo="Confirmar venta"
                mensaje={`¿Registrar venta por ${formatearMoneda(total)}? Esta acción descontará el stock automáticamente.`}
                textoConfirmar="Registrar venta"
                variante="primario"
                cargando={cargando}
                onCancelar={modalConfirm.cerrar}
                onConfirmar={manejarRegistrar}
            />
        </div>
    )
}

export default NuevaVentaPage