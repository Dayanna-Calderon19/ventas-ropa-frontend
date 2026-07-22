import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RiSearchLine, RiCloseLine } from 'react-icons/ri'
import { GridProductos } from '../../components/producto/GridProductos.jsx'
import { FiltrosProducto } from '../../components/producto/FiltrosProducto.jsx'
import { Paginacion } from '../../components/ui/Paginacion.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { useProductos, useCategorias } from '../../hooks/useProductos.js'
import { useBusqueda } from '../../hooks/useBusqueda.js'

const OPCIONES_ORDEN = [
    { valor: '', etiqueta: 'Más recientes' },
    { valor: 'precio_asc', etiqueta: 'Precio: menor a mayor' },
    { valor: 'precio_desc', etiqueta: 'Precio: mayor a menor' },
]

const CatalogoPage = () => {
    const [searchParams] = useSearchParams()
    const categoriaInicial = searchParams.get('categoriaId') || ''
    const busquedaInicial = searchParams.get('busqueda') || ''

    const { datos: categorias } = useCategorias()
    const { termino, terminoRetrasado, manejarCambio: manejarBusqueda, limpiar: limpiarBusqueda } = useBusqueda(400, busquedaInicial)

    const {
        datos,
        meta,
        cargando,
        filtros,
        pagina,
        irAPagina,
        aplicarFiltros,
        limpiarFiltros,
    } = useProductos({ categoriaId: categoriaInicial, busqueda: busquedaInicial || undefined })

    useEffect(() => {
        aplicarFiltros({ busqueda: terminoRetrasado || undefined })
    }, [terminoRetrasado])

    const manejarOrden = (e) => {
        const valor = e.target.value
        if (valor === 'precio_asc') aplicarFiltros({ ordenPrecio: 'asc' })
        else if (valor === 'precio_desc') aplicarFiltros({ ordenPrecio: 'desc' })
        else aplicarFiltros({ ordenPrecio: undefined })
    }

    const productos = datos ?? []

    const categoriaActual = (categorias ?? []).find((c) => c.id === filtros.categoriaId)

    const chipsActivos = [
        filtros.categoriaId && { clave: 'categoriaId', etiqueta: `Categoría: ${categoriaActual?.nombre || '...'}` },
        filtros.talla && { clave: 'talla', etiqueta: `Talla: ${filtros.talla}` },
        filtros.precioMin && { clave: 'precioMin', etiqueta: `Desde S/${filtros.precioMin}` },
        filtros.precioMax && { clave: 'precioMax', etiqueta: `Hasta S/${filtros.precioMax}` },
    ].filter(Boolean)

    const quitarFiltro = (clave) => aplicarFiltros({ [clave]: undefined })

    const hayAlgunFiltro = chipsActivos.length > 0 || !!filtros.busqueda

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">{categoriaActual?.nombre || 'Catálogo'}</h1>
                {meta && (
                    <p className="text-sm text-neutral-500 mt-1">
                        {meta.total} {meta.total === 1 ? 'producto' : 'productos'}
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                    <Input
                        type="text"
                        value={termino}
                        onChange={manejarBusqueda}
                        placeholder="Buscar productos..."
                        icono={<RiSearchLine size={16} />}
                        iconoDerecha={
                            termino ? (
                                <button onClick={limpiarBusqueda} className="hover:text-neutral-700">
                                    <RiCloseLine size={16} />
                                </button>
                            ) : null
                        }
                    />
                </div>

                <FiltrosProducto
                    categorias={categorias ?? []}
                    filtros={filtros}
                    onAplicar={aplicarFiltros}
                    onLimpiar={limpiarFiltros}
                />

                <Select
                    opciones={OPCIONES_ORDEN}
                    placeholder={null}
                    defaultValue=""
                    onChange={manejarOrden}
                    className="sm:w-52"
                />
            </div>

            {chipsActivos.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6 -mt-3">
                    {chipsActivos.map((chip) => (
                        <button
                            key={chip.clave}
                            onClick={() => quitarFiltro(chip.clave)}
                            className="flex items-center gap-1.5 pl-3 pr-2 py-1 text-xs font-medium rounded-full bg-[#c4956a]/10 text-[#a37550] hover:bg-[#c4956a]/20 transition-colors animate-fadeIn"
                        >
                            {chip.etiqueta}
                            <RiCloseLine size={14} />
                        </button>
                    ))}
                    <button
                        onClick={limpiarFiltros}
                        className="text-xs font-medium text-neutral-500 hover:text-neutral-900 underline transition-colors px-1 py-1"
                    >
                        Limpiar todo
                    </button>
                </div>
            )}

            <GridProductos
                productos={productos}
                cargando={cargando}
                columnas={4}
                accionVacio={
                    hayAlgunFiltro ? (
                        <Boton
                            variante="tierra"
                            onClick={() => {
                                limpiarFiltros()
                                limpiarBusqueda()
                            }}
                        >
                            Limpiar filtros
                        </Boton>
                    ) : null
                }
            />

            {meta && meta.totalPages > 1 && (
                <div className="mt-8">
                    <Paginacion meta={meta} onCambiarPagina={irAPagina} />
                </div>
            )}
        </div>
    )
}

export default CatalogoPage