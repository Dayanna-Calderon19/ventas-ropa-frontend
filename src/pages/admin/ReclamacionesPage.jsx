import { useState, useEffect, useCallback } from 'react'
import {
    RiAlertLine,
    RiFileWarningLine,
    RiLightbulbLine,
    RiDownload2Line,
    RiSearchLine,
    RiRefreshLine,
} from 'react-icons/ri'
import { CabeceraSeccion } from '../../components/admin/CabeceraSeccion.jsx'
import { TarjetaResumen } from '../../components/admin/TarjetaResumen.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Paginacion } from '../../components/ui/Paginacion.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { listarReclamaciones, estadisticasReclamaciones } from '../../services/reclamacion.service.js'
import { formatearFechaHora } from '../../utils/formato.js'

const TIPO_CONFIG = {
    QUEJA: {
        etiqueta: 'Queja',
        variante: 'alerta',
        Icono: RiAlertLine,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
    },
    RECLAMO: {
        etiqueta: 'Reclamo',
        variante: 'error',
        Icono: RiFileWarningLine,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
    },
    SUGERENCIA: {
        etiqueta: 'Sugerencia',
        variante: 'info',
        Icono: RiLightbulbLine,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
    },
}

const OPCIONES_TIPO = [
    { valor: '', etiqueta: 'Todos los tipos' },
    { valor: 'QUEJA', etiqueta: 'Quejas' },
    { valor: 'RECLAMO', etiqueta: 'Reclamos' },
    { valor: 'SUGERENCIA', etiqueta: 'Sugerencias' },
]

const FilaReclamacion = ({ reclamacion }) => {
    const cfg = TIPO_CONFIG[reclamacion.tipo] || TIPO_CONFIG.RECLAMO
    const { Icono } = cfg
    return (
        <div className="p-4 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                {/* Icono tipo */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.border} border`}>
                    <Icono size={18} className={cfg.color} />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge variante={cfg.variante}>{cfg.etiqueta}</Badge>
                        <span className="text-xs text-neutral-400">{formatearFechaHora(reclamacion.creadoEn)}</span>
                        <span className="text-xs font-mono text-neutral-300">#{reclamacion.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">{reclamacion.nombre}</p>
                    <p className="text-xs text-neutral-500 mb-2">
                        {reclamacion.correo}
                        {reclamacion.telefono ? ` · ${reclamacion.telefono}` : ''}
                    </p>
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">{reclamacion.descripcion}</p>
                </div>
            </div>
        </div>
    )
}

const SkeletonFila = () => (
    <div className="p-4 border-b border-neutral-100 flex gap-3">
        <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-full" />
        </div>
    </div>
)

const ReclamacionesPage = () => {
    const [reclamaciones, setReclamaciones] = useState([])
    const [stats, setStats] = useState(null)
    const [meta, setMeta] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [cargandoStats, setCargandoStats] = useState(true)
    const [tipoFiltro, setTipoFiltro] = useState('')
    const [pagina, setPagina] = useState(1)

    const cargarStats = useCallback(async () => {
        try {
            setCargandoStats(true)
            const resultado = await estadisticasReclamaciones()
            setStats(resultado.data)
        } catch (err) {
            console.error(err)
        } finally {
            setCargandoStats(false)
        }
    }, [])

    const cargarReclamaciones = useCallback(async () => {
        try {
            setCargando(true)
            const params = { page: pagina, limit: 15 }
            if (tipoFiltro) params.tipo = tipoFiltro
            const resultado = await listarReclamaciones(params)
            setReclamaciones(resultado.data)
            setMeta(resultado.meta)
        } catch (err) {
            console.error(err)
        } finally {
            setCargando(false)
        }
    }, [pagina, tipoFiltro])

    useEffect(() => {
        cargarStats()
    }, [cargarStats])

    useEffect(() => {
        setPagina(1)
    }, [tipoFiltro])

    useEffect(() => {
        cargarReclamaciones()
    }, [cargarReclamaciones])

    const manejarExportarCSV = () => {
        if (!reclamaciones.length) return
        const encabezados = ['ID', 'Tipo', 'Nombre', 'Correo', 'Teléfono', 'Descripción', 'Fecha']
        const filas = reclamaciones.map(r => [
            r.id.slice(0, 8).toUpperCase(),
            r.tipo,
            r.nombre,
            r.correo,
            r.telefono || '',
            `"${r.descripcion.replace(/"/g, '""')}"`,
            new Date(r.creadoEn).toLocaleDateString('es-PE'),
        ])
        const contenido = [encabezados, ...filas].map(f => f.join(',')).join('\n')
        const blob = new Blob(['\uFEFF' + contenido], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `reclamaciones-${new Date().toISOString().slice(0, 10)}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <CabeceraSeccion
                titulo="Libro de Reclamaciones"
                descripcion="Gestiona las quejas, reclamos y sugerencias de los clientes"
                accion={
                    <Boton
                        variante="secundario"
                        icono={<RiDownload2Line size={16} />}
                        onClick={manejarExportarCSV}
                    >
                        Exportar CSV
                    </Boton>
                }
            />

            {/* Tarjetas estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <TarjetaResumen
                    titulo="Quejas"
                    valor={cargandoStats ? '—' : stats?.totalQuejas ?? 0}
                    subtitulo="Atención recibida"
                    Icono={RiAlertLine}
                    color="alerta"
                />
                <TarjetaResumen
                    titulo="Reclamos"
                    valor={cargandoStats ? '—' : stats?.totalReclamos ?? 0}
                    subtitulo="Productos o pedidos"
                    Icono={RiFileWarningLine}
                    color="error"
                />
                <TarjetaResumen
                    titulo="Sugerencias"
                    valor={cargandoStats ? '—' : stats?.totalSugerencias ?? 0}
                    subtitulo="Ideas de mejora"
                    Icono={RiLightbulbLine}
                    color="info"
                />
            </div>

            {/* Lista con filtros */}
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                {/* Barra de filtros */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                        {OPCIONES_TIPO.map(op => (
                            <button
                                key={op.valor}
                                onClick={() => setTipoFiltro(op.valor)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                    tipoFiltro === op.valor
                                        ? 'bg-neutral-900 text-white'
                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`}
                            >
                                {op.etiqueta}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={cargarReclamaciones}
                        className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        title="Actualizar"
                    >
                        <RiRefreshLine size={16} />
                    </button>
                </div>

                {/* Lista */}
                <div>
                    {cargando ? (
                        Array.from({ length: 5 }).map((_, i) => <SkeletonFila key={i} />)
                    ) : reclamaciones.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-3 text-neutral-400">
                            <RiSearchLine size={36} className="text-neutral-300" />
                            <p className="text-sm">No hay registros para mostrar</p>
                        </div>
                    ) : (
                        reclamaciones.map(r => <FilaReclamacion key={r.id} reclamacion={r} />)
                    )}
                </div>

                {/* Paginación */}
                {meta && meta.totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-neutral-100">
                        <Paginacion meta={meta} onCambiarPagina={setPagina} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReclamacionesPage
