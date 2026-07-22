import { Link } from 'react-router-dom'
import { RiShoppingBagLine, RiHeartLine, RiHeartFill } from 'react-icons/ri'
import { formatearMoneda } from '../../utils/formato.js'
import { STOCK_MINIMO_ALERTA } from '../../utils/constantes.js'
import { useFavoritos } from '../../hooks/useFavoritos.js'

export const TarjetaProducto = ({ producto }) => {
    const { estaEnFavoritos, alternarFavorito } = useFavoritos()
    const esFavorito = estaEnFavoritos(producto.id)

    const precioMinimo = producto.variantes?.length
        ? Math.min(...producto.variantes.map((v) => v.precio))
        : producto.precioBase

    const stockTotal = producto.variantes?.reduce((acc, v) => acc + v.stock, 0) ?? 0
    const sinStock = stockTotal === 0
    const stockBajo = !sinStock && stockTotal <= STOCK_MINIMO_ALERTA

    const imagenPrincipal =
        producto.imagenes?.find((i) => i.esPrincipal)?.url ||
        producto.imagenes?.[0]?.url ||
        producto.imagenUrl ||
        null

    const manejarFavorito = (e) => {
        e.preventDefault()
        e.stopPropagation()
        alternarFavorito(producto)
    }

    return (
        <Link
            to={`/producto/${producto.id}`}
            className="group flex flex-col bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md hover:border-neutral-300 transition-all duration-200"
        >
            <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                {imagenPrincipal ? (
                    <img
                        src={imagenPrincipal}
                        alt={producto.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <RiShoppingBagLine size={40} className="text-neutral-300" />
                    </div>
                )}

                <button
                    onClick={manejarFavorito}
                    aria-label={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-neutral-500 hover:text-[#b8933f] transition-colors shadow-sm"
                >
                    {esFavorito ? <RiHeartFill size={16} className="text-[#b8933f]" /> : <RiHeartLine size={16} />}
                </button>

                {producto.destacado && !sinStock && (
                    <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        DESTACADO
                    </span>
                )}

                {sinStock && (
                    <span className="absolute top-2 left-2 bg-neutral-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        AGOTADO
                    </span>
                )}

                {stockBajo && !sinStock && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        ÚLTIMAS UNIDADES
                    </span>
                )}
            </div>

            <div className="p-3 flex flex-col gap-1">
                <p className="text-xs text-neutral-400 uppercase tracking-wide">
                    {producto.categoria?.nombre}
                </p>
                <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 leading-snug">
                    {producto.nombre}
                </h3>
                <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {formatearMoneda(precioMinimo)}
                </p>
            </div>
        </Link>
    )
}