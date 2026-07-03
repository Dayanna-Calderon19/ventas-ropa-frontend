const tamanios = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-[3px]',
}

export const Spinner = ({ tamanio = 'md', className = '' }) => {
    return (
        <span
            role="status"
            aria-label="Cargando"
            className={`inline-block rounded-full border-neutral-300 border-t-neutral-900 animate-spin ${tamanios[tamanio] ?? tamanios.md} ${className}`}
        />
    )
}

export const CargandoPagina = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner tamanio="lg" />
    </div>
)