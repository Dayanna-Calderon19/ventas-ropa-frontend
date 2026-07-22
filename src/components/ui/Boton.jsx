const variantes = {
    primario: 'bg-neutral-900 text-white hover:bg-neutral-700 border border-neutral-900',
    secundario: 'bg-white text-neutral-900 border border-neutral-300 hover:border-neutral-900',
    fantasma: 'bg-transparent text-neutral-900 border border-transparent hover:bg-neutral-100',
    peligro: 'bg-red-600 text-white border border-red-600 hover:bg-red-700',
    tierra: 'bg-[#b8933f] text-white border border-[#b8933f] hover:bg-[#8f7130]',
    contorno: 'bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white/60',
}

const tamanios = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-5 py-2 text-sm h-10',
    lg: 'px-7 py-3 text-base h-12',
}

export const Boton = ({
    children,
    variante = 'primario',
    tamanio = 'md',
    cargando = false,
    icono = null,
    iconoDerecha = false,
    ancho = false,
    disabled = false,
    type = 'button',
    onClick,
    className = '',
    ...props
}) => {
    const clases = [
        'inline-flex items-center justify-center gap-2 font-medium rounded transition-colors duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-px',
        variantes[variante] ?? variantes.primario,
        tamanios[tamanio] ?? tamanios.md,
        ancho ? 'w-full' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <button
            type={type}
            className={clases}
            disabled={disabled || cargando}
            onClick={onClick}
            {...props}
        >
            {cargando ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                icono && !iconoDerecha && <span className="flex items-center text-[1.1em]">{icono}</span>
            )}
            <span>{children}</span>
            {!cargando && icono && iconoDerecha && (
                <span className="flex items-center text-[1.1em]">{icono}</span>
            )}
        </button>
    )
}