import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { RiArrowLeftLine, RiShoppingBagLine, RiCheckLine } from 'react-icons/ri'
import { useProducto } from '../../hooks/useProductos.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useCarrito } from '../../hooks/useCarrito.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { SelectorVariante } from '../../components/producto/SelectorProducto.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { EstadoVacio } from '../../components/ui/EstadoVacio.jsx'
import { formatearMoneda } from '../../utils/formato.js'

const ProductoDetallePage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { estaAutenticado } = useAuth()
    const { agregarItem, estaEnCarrito } = useCarrito()
    const { exito, advertencia } = useToast()

    const { datos: producto, cargando, error } = useProducto(id)

    const [varianteSeleccionada, setVarianteSeleccionada] = useState(null)
    const [imagenActiva, setImagenActiva] = useState(0)
    const [cantidad, setCantidad] = useState(1)

    if (cargando) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner tamanio="lg" />
            </div>
        )
    }

    if (error || !producto) {
        return (
            <EstadoVacio
                titulo="Producto no encontrado"
                descripcion="El producto que buscas no existe o fue eliminado."
                accion={
                    <Boton variante="primario" onClick={() => navigate('/catalogo')}>
                        Volver al catálogo
                    </Boton>
                }
            />
        )
    }

    const imagenes = producto.imagenes?.length
        ? producto.imagenes
        : producto.imagenUrl
            ? [{ url: producto.imagenUrl, altText: producto.nombre }]
            : []

    const variantesActivas = producto.variantes?.filter((v) => v.activo) ?? []
    const enCarrito = varianteSeleccionada ? estaEnCarrito(varianteSeleccionada.id) : false

    const manejarAgregarCarrito = () => {
        if (!estaAutenticado) {
            navigate('/login', { state: { desde: { pathname: `/producto/${id}` } } })
            return
        }
        if (!varianteSeleccionada) {
            advertencia('Selecciona una talla y color antes de continuar')
            return
        }
        if (varianteSeleccionada.stock < cantidad) {
            advertencia('No hay suficiente stock disponible')
            return
        }
        agregarItem(
            { ...varianteSeleccionada, producto: { nombre: producto.nombre, imagenUrl: imagenes[0]?.url } },
            cantidad
        )
        exito(`${producto.nombre} agregado al carrito`)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-6"
            >
                <RiArrowLeftLine size={16} />
                Volver
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                <div className="flex flex-col gap-3">
                    <div className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden">
                        {imagenes.length > 0 ? (
                            <img
                                src={imagenes[imagenActiva]?.url}
                                alt={imagenes[imagenActiva]?.altText || producto.nombre}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <RiShoppingBagLine size={48} className="text-neutral-300" />
                            </div>
                        )}
                    </div>

                    {imagenes.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {imagenes.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setImagenActiva(i)}
                                    className={`flex-shrink-0 w-16 h-20 rounded border-2 overflow-hidden transition-colors ${imagenActiva === i ? 'border-[#b8933f]' : 'border-transparent'
                                        }`}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.altText || `${producto.nombre} ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {producto.categoria && (
                                <Link
                                    to={`/catalogo?categoriaId=${producto.categoria.id}`}
                                    className="text-xs text-neutral-500 uppercase tracking-wide hover:text-neutral-900 transition-colors"
                                >
                                    {producto.categoria.nombre}
                                </Link>
                            )}
                            {producto.destacado && <Badge variante="tierra">Destacado</Badge>}
                        </div>
                        <h1 className="text-2xl font-bold text-neutral-900 mb-3">{producto.nombre}</h1>
                        <p className="text-2xl font-semibold text-neutral-900">
                            {varianteSeleccionada
                                ? formatearMoneda(varianteSeleccionada.precio)
                                : formatearMoneda(producto.precioBase)}
                        </p>
                    </div>

                    {producto.descripcion && (
                        <p className="text-sm text-neutral-600 leading-relaxed">{producto.descripcion}</p>
                    )}

                    {variantesActivas.length > 0 ? (
                        <SelectorVariante
                            variantes={variantesActivas}
                            seleccionada={varianteSeleccionada}
                            onSeleccionar={setVarianteSeleccionada}
                        />
                    ) : (
                        <Badge variante="error">Sin stock disponible</Badge>
                    )}

                    {varianteSeleccionada && varianteSeleccionada.stock > 0 && (
                        <div>
                            <p className="text-sm font-medium text-neutral-700 mb-2">Cantidad</p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                                    disabled={cantidad <= 1}
                                    className="w-9 h-9 border border-neutral-300 rounded text-neutral-700 hover:border-[#b8933f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-medium"
                                >
                                    −
                                </button>
                                <span className="w-8 text-center text-sm font-medium">{cantidad}</span>
                                <button
                                    onClick={() => setCantidad((c) => Math.min(varianteSeleccionada.stock, c + 1))}
                                    disabled={cantidad >= varianteSeleccionada.stock}
                                    className="w-9 h-9 border border-neutral-300 rounded text-neutral-700 hover:border-[#b8933f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-medium"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}

                    <Boton
                        variante={enCarrito ? 'secundario' : 'primario'}
                        tamanio="lg"
                        ancho
                        icono={enCarrito ? <RiCheckLine size={18} /> : <RiShoppingBagLine size={18} />}
                        onClick={manejarAgregarCarrito}
                        disabled={variantesActivas.length === 0}
                    >
                        {enCarrito ? 'En el carrito' : 'Agregar al carrito'}
                    </Boton>

                    {!estaAutenticado && (
                        <p className="text-xs text-neutral-500 text-center">
                            Necesitas{' '}
                            <Link to="/login" className="underline hover:text-neutral-900">
                                iniciar sesión
                            </Link>{' '}
                            para comprar.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductoDetallePage