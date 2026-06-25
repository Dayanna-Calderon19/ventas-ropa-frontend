import { Skeleton } from '../ui/Skeleton.jsx'

export const TarjetaResumen = ({ titulo, valor, subtitulo, extra, Icono, color = 'neutral', cargando = false }) => {
    const colores = {
        neutral: 'bg-neutral-100 text-neutral-600',
        verde: 'bg-green-100 text-green-600',
        azul: 'bg-blue-100 text-blue-600',
        naranja: 'bg-orange-100 text-orange-600',
        rojo: 'bg-red-100 text-red-600',
        tierra: 'bg-[#f5f0e8] text-[#a37550]',
    }

    if (cargando) {
        return (
            <div className="bg-white border border-neutral-200 rounded-lg p-5 flex flex-col gap-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-3 w-24" />
            </div>
        )
    }

    return (
        <div className="bg-white border border-neutral-200 rounded-lg p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">{titulo}</span>
                {Icono && (
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colores[color] ?? colores.neutral}`}>
                        <Icono size={18} />
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-neutral-900">{valor ?? '—'}</p>
            {extra ? extra : subtitulo && <p className="text-xs text-neutral-400">{subtitulo}</p>}
        </div>
    )
}