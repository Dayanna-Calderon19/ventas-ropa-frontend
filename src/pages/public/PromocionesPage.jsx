import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiCouponLine, RiFileCopyLine, RiAlarmWarningLine, RiErrorWarningLine } from 'react-icons/ri'
import { listarPromociones } from '../../services/promocion.service.js'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { EstadoVacio } from '../../components/ui/EstadoVacio.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatearMoneda, formatearFecha } from '../../utils/formato.js'
import { extraerMensajeError } from '../../utils/manejarError.js'

const HORAS_URGENCIA = 48

const obtenerEtiquetaDescuento = (promo) => {
    if (promo.tipoDescuento === 'PORCENTAJE') return `${promo.valorDescuento}% OFF`
    return `${formatearMoneda(promo.valorDescuento)} OFF`
}

const terminaPronto = (finEn) => {
    const horasRestantes = (new Date(finEn) - new Date()) / (1000 * 60 * 60)
    return horasRestantes > 0 && horasRestantes <= HORAS_URGENCIA
}

const TarjetaPromocion = ({ promo }) => {
    const { exito } = useToast()

    const copiarCodigo = () => {
        navigator.clipboard.writeText(promo.codigo)
        exito('Código copiado al portapapeles')
    }

    return (
        <div className="flex flex-col bg-white border border-neutral-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-[#b8933f]/40 transition-all duration-200">
            <div className="flex items-start justify-between gap-3 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#b8933f] text-white text-sm font-bold">
                    {obtenerEtiquetaDescuento(promo)}
                </span>
                {terminaPronto(promo.finEn) && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                        <RiAlarmWarningLine size={14} />
                        Termina pronto
                    </span>
                )}
            </div>

            <h2 className="text-lg font-bold text-neutral-900 mb-1">{promo.nombre}</h2>
            {promo.descripcion && (
                <p className="text-sm text-neutral-600 mb-3 flex-1">{promo.descripcion}</p>
            )}

            {promo.montoMinimo && (
                <p className="text-xs text-neutral-500 mb-3">
                    Válido en compras desde {formatearMoneda(promo.montoMinimo)}
                </p>
            )}

            {promo.codigo && (
                <button
                    onClick={copiarCodigo}
                    className="flex items-center justify-between gap-2 border border-dashed border-[#b8933f] bg-[#b8933f]/5 rounded-lg px-3 py-2 mb-3 text-left hover:bg-[#b8933f]/10 transition-colors"
                >
                    <span className="font-mono font-semibold text-sm text-neutral-900">{promo.codigo}</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-[#8f7130]">
                        <RiFileCopyLine size={14} />
                        Copiar
                    </span>
                </button>
            )}

            <p className="text-xs text-neutral-400 mb-4">
                Vigente hasta el {formatearFecha(promo.finEn)}
            </p>

            <Link to="/catalogo" className="mt-auto">
                <Boton variante="tierra" ancho>Ver catálogo</Boton>
            </Link>
        </div>
    )
}

const PromocionesPage = () => {
    const [promociones, setPromociones] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    const cargarPromociones = () => {
        setCargando(true)
        setError(null)
        listarPromociones({ activo: 'true' })
            .then((data) => setPromociones(Array.isArray(data) ? data : (data.data || [])))
            .catch((err) => setError(extraerMensajeError(err)))
            .finally(() => setCargando(false))
    }

    useEffect(() => {
        cargarPromociones()
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

            {error ? (
                <EstadoVacio
                    icono={<RiErrorWarningLine size={40} className="text-red-400" />}
                    titulo="No pudimos cargar las promociones"
                    descripcion={error}
                    accion={<Boton variante="tierra" onClick={cargarPromociones}>Reintentar</Boton>}
                />
            ) : promociones.length === 0 ? (
                <EstadoVacio
                    icono={<RiCouponLine size={40} className="text-neutral-300" />}
                    titulo="Sin promociones activas"
                    descripcion="No hay promociones disponibles en este momento. Vuelve pronto."
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promociones.map((promo) => (
                        <TarjetaPromocion key={promo.id} promo={promo} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default PromocionesPage
