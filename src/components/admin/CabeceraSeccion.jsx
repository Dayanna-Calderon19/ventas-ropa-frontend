export const CabeceraSeccion = ({ titulo, descripcion, accion = null }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
            <h1 className="text-xl font-bold text-neutral-900">{titulo}</h1>
            {descripcion && <p className="text-sm text-neutral-500 mt-0.5">{descripcion}</p>}
        </div>
        {accion && <div className="flex-shrink-0">{accion}</div>}
    </div>
)