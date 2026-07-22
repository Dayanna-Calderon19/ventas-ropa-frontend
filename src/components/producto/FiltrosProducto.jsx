import { useState, useEffect } from 'react'
import { RiFilterLine, RiCloseLine } from 'react-icons/ri'
import { Input } from '../ui/Input.jsx'
import { Select } from '../ui/Select.jsx'
import { Boton } from '../ui/Boton.jsx'

const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const FiltrosProducto = ({ categorias = [], filtros, onAplicar, onLimpiar }) => {
    const [abierto, setAbierto] = useState(false)
    const [valores, setValores] = useState({
        categoriaId: filtros.categoriaId || '',
        talla: filtros.talla || '',
        precioMin: filtros.precioMin || '',
        precioMax: filtros.precioMax || '',
    })

    useEffect(() => {
        setValores({
            categoriaId: filtros.categoriaId || '',
            talla: filtros.talla || '',
            precioMin: filtros.precioMin || '',
            precioMax: filtros.precioMax || '',
        })
    }, [filtros.categoriaId, filtros.talla, filtros.precioMin, filtros.precioMax])

    const manejarCambio = (e) => {
        const { name, value } = e.target
        setValores((prev) => ({ ...prev, [name]: value }))
    }

    const manejarAplicar = () => {
        const payload = {}
        if (valores.categoriaId) payload.categoriaId = valores.categoriaId
        if (valores.talla) payload.talla = valores.talla
        if (valores.precioMin) payload.precioMin = valores.precioMin
        if (valores.precioMax) payload.precioMax = valores.precioMax
        onAplicar(payload)
        setAbierto(false)
    }

    const manejarLimpiar = () => {
        setValores({ categoriaId: '', talla: '', precioMin: '', precioMax: '' })
        onLimpiar()
        setAbierto(false)
    }

    const hayFiltrosActivos = Object.values(valores).some((v) => v !== '')

    return (
        <div className="relative">
            <Boton
                variante="secundario"
                tamanio="md"
                icono={<RiFilterLine size={16} />}
                onClick={() => setAbierto((p) => !p)}
                className={hayFiltrosActivos ? 'border-[#c4956a]' : ''}
            >
                Filtros
                {hayFiltrosActivos && (
                    <span className="ml-1 w-5 h-5 bg-[#c4956a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {Object.values(valores).filter(Boolean).length}
                    </span>
                )}
            </Boton>

            {abierto && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setAbierto(false)}
                    />
                    <div className="absolute left-0 top-full mt-2 z-20 w-72 bg-white border border-neutral-200 rounded-lg shadow-lg p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-neutral-900">Filtros</h3>
                            <button
                                onClick={() => setAbierto(false)}
                                className="text-neutral-400 hover:text-neutral-700 transition-colors"
                            >
                                <RiCloseLine size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Select
                                label="Categoría"
                                name="categoriaId"
                                value={valores.categoriaId}
                                onChange={manejarCambio}
                                placeholder="Todas las categorías"
                                opciones={categorias.map((c) => ({ valor: c.id, etiqueta: c.nombre }))}
                            />

                            <div>
                                <p className="text-sm font-medium text-neutral-700 mb-2">Talla</p>
                                <div className="flex flex-wrap gap-2">
                                    {TALLAS.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() =>
                                                setValores((prev) => ({
                                                    ...prev,
                                                    talla: prev.talla === t ? '' : t,
                                                }))
                                            }
                                            className={`px-3 py-1 text-xs rounded border transition-colors ${valores.talla === t
                                                    ? 'bg-[#c4956a] text-white border-[#c4956a]'
                                                    : 'border-neutral-300 text-neutral-700 hover:border-[#c4956a]'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-neutral-700 mb-2">Precio (S/)</p>
                                <div className="flex gap-2 items-center">
                                    <Input
                                        type="number"
                                        name="precioMin"
                                        value={valores.precioMin}
                                        onChange={manejarCambio}
                                        placeholder="Mín"
                                        className="flex-1"
                                    />
                                    <span className="text-neutral-400 text-sm">—</span>
                                    <Input
                                        type="number"
                                        name="precioMax"
                                        value={valores.precioMax}
                                        onChange={manejarCambio}
                                        placeholder="Máx"
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-5 pt-4 border-t border-neutral-100">
                            <Boton variante="fantasma" tamanio="sm" ancho onClick={manejarLimpiar}>
                                Limpiar
                            </Boton>
                            <Boton variante="tierra" tamanio="sm" ancho onClick={manejarAplicar}>
                                Aplicar
                            </Boton>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}