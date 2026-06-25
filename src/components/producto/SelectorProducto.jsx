export const SelectorVariante = ({ variantes = [], seleccionada, onSeleccionar }) => {
    const tallas = [...new Set(variantes.map((v) => v.talla))]
    const tallaSeleccionada = seleccionada?.talla || null

    const coloresParaTalla = tallaSeleccionada
        ? variantes.filter((v) => v.talla === tallaSeleccionada)
        : []

    const manejarTalla = (talla) => {
        const primeraVariante = variantes.find((v) => v.talla === talla && v.stock > 0)
        onSeleccionar(primeraVariante || variantes.find((v) => v.talla === talla))
    }

    const manejarColor = (varianteId) => {
        const variante = variantes.find((v) => v.id === varianteId)
        if (variante) onSeleccionar(variante)
    }

    return (
        <div className="flex flex-col gap-5">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-neutral-900">Talla</p>
                    {tallaSeleccionada && (
                        <span className="text-sm text-neutral-500">{tallaSeleccionada}</span>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {tallas.map((t) => {
                        const hayStock = variantes.some((v) => v.talla === t && v.stock > 0)
                        const activa = tallaSeleccionada === t
                        return (
                            <button
                                key={t}
                                onClick={() => manejarTalla(t)}
                                disabled={!hayStock}
                                className={`w-12 h-10 text-sm rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${activa
                                        ? 'bg-neutral-900 text-white border-neutral-900'
                                        : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                                    }`}
                            >
                                {t}
                            </button>
                        )
                    })}
                </div>
            </div>

            {tallaSeleccionada && coloresParaTalla.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-neutral-900">Color</p>
                        {seleccionada && (
                            <span className="text-sm text-neutral-500">{seleccionada.color}</span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {coloresParaTalla.map((v) => {
                            const activa = seleccionada?.id === v.id
                            return (
                                <button
                                    key={v.id}
                                    onClick={() => manejarColor(v.id)}
                                    disabled={v.stock === 0}
                                    className={`px-3 py-1.5 text-xs rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${activa
                                            ? 'bg-neutral-900 text-white border-neutral-900'
                                            : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                                        }`}
                                >
                                    {v.color}
                                    {v.stock === 0 && ' (agotado)'}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {seleccionada && (
                <p className="text-xs text-neutral-500">
                    {seleccionada.stock > 0
                        ? `${seleccionada.stock} unidades disponibles`
                        : 'Sin stock para esta variante'}
                </p>
            )}
        </div>
    )
}