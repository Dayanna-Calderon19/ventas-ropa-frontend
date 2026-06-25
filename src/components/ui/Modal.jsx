import { useEffect } from 'react'
import { RiCloseLine } from 'react-icons/ri'

const tamanios = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
}

export const Modal = ({
    abierto,
    onCerrar,
    titulo,
    children,
    tamanio = 'md',
    footer = null,
    cerrarAlClickFondo = true,
}) => {
    useEffect(() => {
        if (abierto) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [abierto])

    useEffect(() => {
        const manejarEsc = (e) => {
            if (e.key === 'Escape' && abierto) onCerrar()
        }
        document.addEventListener('keydown', manejarEsc)
        return () => document.removeEventListener('keydown', manejarEsc)
    }, [abierto, onCerrar])

    if (!abierto) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={cerrarAlClickFondo ? onCerrar : undefined}
            />
            <div
                className={`relative w-full ${tamanios[tamanio] ?? tamanios.md} bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh]`}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-900">{titulo}</h2>
                    <button
                        onClick={onCerrar}
                        className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                    >
                        <RiCloseLine size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
                {footer && (
                    <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}