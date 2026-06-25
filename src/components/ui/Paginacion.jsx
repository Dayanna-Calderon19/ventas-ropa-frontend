import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'

export const Paginacion = ({ meta, onCambiarPagina, className = '' }) => {
    if (!meta || meta.totalPages <= 1) return null

    const { page, totalPages, total, limit } = meta
    const inicio = (page - 1) * limit + 1
    const fin = Math.min(page * limit, total)

    const paginas = []
    const delta = 1

    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
        paginas.push(i)
    }

    if (paginas[0] > 1) {
        if (paginas[0] > 2) paginas.unshift('...')
        paginas.unshift(1)
    }

    if (paginas[paginas.length - 1] < totalPages) {
        if (paginas[paginas.length - 1] < totalPages - 1) paginas.push('...')
        paginas.push(totalPages)
    }

    return (
        <div className={`flex items-center justify-between gap-4 ${className}`}>
            <span className="text-sm text-neutral-500">
                Mostrando {inicio}–{fin} de {total}
            </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onCambiarPagina(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded border border-neutral-200 text-neutral-600 hover:border-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <RiArrowLeftLine size={16} />
                </button>
                {paginas.map((p, i) =>
                    p === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-neutral-400 text-sm">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onCambiarPagina(p)}
                            className={`w-9 h-9 rounded border text-sm transition-colors ${p === page
                                    ? 'bg-neutral-900 text-white border-neutral-900'
                                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-900'
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    onClick={() => onCambiarPagina(page + 1)}
                    disabled={page === totalPages}
                    className="p-2 rounded border border-neutral-200 text-neutral-600 hover:border-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <RiArrowRightLine size={16} />
                </button>
            </div>
        </div>
    )
}