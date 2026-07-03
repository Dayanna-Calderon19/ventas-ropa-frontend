import { RiInboxLine } from 'react-icons/ri'

export const EstadoVacio = ({
    icono = <RiInboxLine size={40} className="text-neutral-300" />,
    titulo = 'Sin resultados',
    descripcion = 'No se encontraron elementos.',
    accion = null,
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
            <div className="mb-4">{icono}</div>
            <h3 className="text-base font-semibold text-neutral-700 mb-1">{titulo}</h3>
            <p className="text-sm text-neutral-500 max-w-xs">{descripcion}</p>
            {accion && <div className="mt-5">{accion}</div>}
        </div>
    )
}