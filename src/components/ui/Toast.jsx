import { createContext, useContext } from 'react'
import { useNotificacion } from '../../hooks/useNotificacion.js'
import { RiCheckboxCircleLine, RiErrorWarningLine, RiInformationLine, RiAlertLine, RiCloseLine } from 'react-icons/ri'

const ToastContext = createContext(null)

const iconos = {
    exito: { Icono: RiCheckboxCircleLine, clases: 'text-green-600' },
    error: { Icono: RiErrorWarningLine, clases: 'text-red-600' },
    advertencia: { Icono: RiAlertLine, clases: 'text-orange-600' },
    info: { Icono: RiInformationLine, clases: 'text-blue-600' },
}

export const ToastProvider = ({ children }) => {
    const notificacion = useNotificacion()

    return (
        <ToastContext.Provider value={notificacion}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                {notificacion.notificaciones.map((n) => {
                    const { Icono, clases } = iconos[n.tipo] ?? iconos.info
                    return (
                        <div
                            key={n.id}
                            className="pointer-events-auto flex items-start gap-3 bg-white border border-neutral-200 rounded-lg shadow-lg px-4 py-3 text-sm animate-in slide-in-from-right"
                        >
                            <Icono size={18} className={`flex-shrink-0 mt-0.5 ${clases}`} />
                            <span className="flex-1 text-neutral-800">{n.mensaje}</span>
                            <button
                                onClick={() => notificacion.eliminar(n.id)}
                                className="flex-shrink-0 text-neutral-400 hover:text-neutral-700 transition-colors"
                            >
                                <RiCloseLine size={16} />
                            </button>
                        </div>
                    )
                })}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
    return ctx
}