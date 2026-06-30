import { useId } from 'react';

export const Select = ({
    label,
    error,
    ayuda,
    opciones = [],
    placeholder = 'Seleccionar...',
    id,
    className = '',
    requerido = false,
    ...props
}) => {
    const generatedId = useId();
    const selectId = id || `select-${generatedId.replace(/:/g, '')}`;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label htmlFor={selectId} className="text-sm font-medium text-neutral-700">
                    {label}
                    {requerido && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}
            <select
                id={selectId}
                className={[
                    'w-full h-10 px-3 text-sm rounded border bg-white text-neutral-900',
                    'focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors',
                    error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300',
                ]
                    .filter(Boolean)
                    .join(' ')}
                aria-invalid={!!error}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {opciones.map((op) => (
                    <option key={op.valor} value={op.valor}>
                        {op.etiqueta}
                    </option>
                ))}
            </select>
            {error && <p className="text-xs text-red-600">{error}</p>}
            {!error && ayuda && <p className="text-xs text-neutral-500">{ayuda}</p>}
        </div>
    )
}