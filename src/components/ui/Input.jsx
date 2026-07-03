import { useId } from 'react';

export const Input = ({
    label,
    error,
    ayuda,
    icono,
    iconoDerecha,
    type = 'text',
    id,
    className = '',
    requerido = false,
    maxLength,
    ...props
}) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId.replace(/:/g, '')}`;
    
    const limit = type === 'tel' ? 9 : maxLength;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
                    {label}
                    {requerido && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}
            <div className="relative">
                {icono && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 flex items-center">
                        {icono}
                    </span>
                )}
                <input
                    id={inputId}
                    type={type}
                    maxLength={limit}
                    className={[
                        'w-full h-10 px-3 text-sm rounded border bg-white text-neutral-900 placeholder-neutral-400',
                        'focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors',
                        error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300',
                        icono ? 'pl-9' : '',
                        iconoDerecha ? 'pr-9' : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    aria-invalid={!!error}
                    {...props}
                />
                {iconoDerecha && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 flex items-center">
                        {iconoDerecha}
                    </span>
                )}
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            {!error && ayuda && <p className="text-xs text-neutral-500">{ayuda}</p>}
        </div>
    )
}