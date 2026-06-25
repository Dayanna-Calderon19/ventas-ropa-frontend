import { RiDeleteBinLine } from 'react-icons/ri'
import { useCarrito } from '../../hooks/useCarrito.js'
import { formatearMoneda } from '../../utils/formato.js'

export const ItemCarrito = ({ item }) => {
    const { cambiarCantidad, quitarItem } = useCarrito()

    return (
        <div className="flex gap-4 py-4 border-b border-neutral-100 last:border-0">
            <div className="w-20 h-24 bg-neutral-100 rounded flex-shrink-0 overflow-hidden">
                {item.imagenUrl ? (
                    <img
                        src={item.imagenUrl}
                        alt={item.nombreProducto}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-200" />
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="text-sm font-medium text-neutral-900 truncate">{item.nombreProducto}</p>
                <p className="text-xs text-neutral-500">
                    {item.talla} · {item.color}
                </p>
                <p className="text-sm font-semibold text-neutral-900">
                    {formatearMoneda(item.precio)}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => cambiarCantidad(item.varianteId, item.cantidad - 1)}
                            className="w-7 h-7 border border-neutral-300 rounded text-neutral-700 hover:border-neutral-900 disabled:opacity-40 transition-colors text-sm font-medium"
                            disabled={item.cantidad <= 1}
                        >
                            −
                        </button>
                        <span className="w-6 text-center text-sm">{item.cantidad}</span>
                        <button
                            onClick={() => cambiarCantidad(item.varianteId, item.cantidad + 1)}
                            className="w-7 h-7 border border-neutral-300 rounded text-neutral-700 hover:border-neutral-900 disabled:opacity-40 transition-colors text-sm font-medium"
                            disabled={item.cantidad >= item.stock}
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={() => quitarItem(item.varianteId)}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                    >
                        <RiDeleteBinLine size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}