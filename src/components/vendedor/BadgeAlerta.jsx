export const BadgeAlerta = ({ count, variante = 'error' }) => {
    if (!count || count <= 0) return null

    const colores = {
        error: 'bg-red-500 text-white',
        alerta: 'bg-orange-400 text-white',
        info: 'bg-blue-500 text-white',
        neutral: 'bg-neutral-500 text-white',
    }

    return (
        <span
            className={`
        ml-auto flex-shrink-0 min-w-[18px] h-[18px] px-1
        rounded-full text-[10px] font-bold
        flex items-center justify-center
        ${colores[variante] ?? colores.error}
        `}
        >
            {count > 99 ? '99+' : count}
        </span>
    )
}