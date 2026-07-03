export const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-neutral-200 rounded ${className}`} />
)

export const SkeletonTexto = ({ lineas = 3 }) => (
    <div className="flex flex-col gap-2">
        {Array.from({ length: lineas }).map((_, i) => (
            <Skeleton
                key={i}
                className={`h-4 ${i === lineas - 1 ? 'w-3/4' : 'w-full'}`}
            />
        ))}
    </div>
)

export const SkeletonTarjeta = () => (
    <div className="flex flex-col gap-3">
        <Skeleton className="w-full aspect-[3/4] rounded" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
    </div>
)