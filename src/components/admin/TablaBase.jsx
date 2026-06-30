import { Skeleton } from '../ui/Skeleton.jsx'
import { EstadoVacio } from '../ui/EstadoVacio.jsx'

export const TablaBase = ({ columnas = [], filas = [], cargando = false, accionFila = null }) => {
    if (cargando) {
        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200">
                            {columnas.map((col) => (
                                <th key={col.clave} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                                    {col.titulo}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-b border-neutral-100">
                                {columnas.map((col) => (
                                    <td key={col.clave} className="px-4 py-3">
                                        <Skeleton className="h-4 w-full max-w-[120px]" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    if (!filas.length) {
        return <EstadoVacio />
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-neutral-200">
                        {columnas.map((col) => (
                            <th
                                key={col.clave}
                                className={`text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap ${col.className ?? ''}`}
                            >
                                {col.titulo}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filas.map((fila) => (
                        <tr
                            key={fila.id}
                            onClick={accionFila ? () => accionFila(fila) : undefined}
                            className={`border-b border-neutral-100 last:border-0 ${accionFila ? 'cursor-pointer hover:bg-neutral-50' : ''} transition-colors`}
                        >
                            {columnas.map((col) => (
                                <td key={col.clave} className={`px-4 py-3 ${col.className ?? ''}`}>
                                    {col.render ? col.render(fila) : fila[col.clave] ?? '—'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}