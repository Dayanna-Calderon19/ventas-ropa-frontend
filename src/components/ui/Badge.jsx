const variantes = {
    default: 'bg-neutral-100 text-neutral-700',
    exito: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-700',
    alerta: 'bg-orange-100 text-orange-700',
    info: 'bg-blue-100 text-blue-700',
    tierra: 'bg-[#f5f0e8] text-[#a37550]',
}

export const Badge = ({ children, variante = 'default', className = '' }) => {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantes[variante] ?? variantes.default} ${className}`}
        >
            {children}
        </span>
    )
}