import { RiCheckboxCircleLine, RiErrorWarningLine, RiInformationLine, RiAlertLine } from 'react-icons/ri'

const config = {
    exito: { clases: 'bg-green-50 border-green-200 text-green-800', Icono: RiCheckboxCircleLine },
    error: { clases: 'bg-red-50 border-red-200 text-red-800', Icono: RiErrorWarningLine },
    alerta: { clases: 'bg-orange-50 border-orange-200 text-orange-800', Icono: RiAlertLine },
    info: { clases: 'bg-blue-50 border-blue-200 text-blue-800', Icono: RiInformationLine },
}

export const Alerta = ({ tipo = 'info', mensaje, className = '' }) => {
    const { clases, Icono } = config[tipo] ?? config.info

    if (!mensaje) return null

    return (
        <div className={`flex items-start gap-3 px-4 py-3 rounded border text-sm ${clases} ${className}`} role="alert">
            <Icono size={18} className="flex-shrink-0 mt-0.5" />
            <span>{mensaje}</span>
        </div>
    )
}