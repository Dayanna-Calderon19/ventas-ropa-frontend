import { useEffect, useState } from 'react'
import { listarPromociones } from '../../services/promocion.service.js'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { formatearFechaHora } from '../../utils/formato.js'

const PromocionesPage = () => {
    const [promociones, setPromociones] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        listarPromociones({ activo: 'true' })
            .then(data => setPromociones(Array.isArray(data) ? data : (data.data || [])))
            .finally(() => setCargando(false))
    }, [])

    if (cargando) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner tamanio="lg" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <h1 className="text-3xl font-bold text-neutral-900 mb-8">Promociones vigentes</h1>
            {promociones.length === 0 ? (
                <p className="text-neutral-500">No hay promociones disponibles en este momento.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promociones.map((promo) => (
                        <div key={promo.id} className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-neutral-900 mb-2">{promo.nombre}</h2>
                            <p className="text-sm text-neutral-600 mb-4">{promo.descripcion}</p>
                            {promo.codigo && (
                                <p className="text-sm font-semibold text-neutral-900 mb-2">
                                    Código: <span className="bg-neutral-100 px-2 py-1 rounded font-mono">{promo.codigo}</span>
                                </p>
                            )}
                            <p className="text-xs text-neutral-400">
                                Vigente hasta el {formatearFechaHora(promo.finEn)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PromocionesPage