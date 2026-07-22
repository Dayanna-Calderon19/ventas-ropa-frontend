import { TarjetaProducto } from './TarjetaProducto.jsx'
import { SkeletonTarjeta } from '../ui/Skeleton.jsx'
import { EstadoVacio } from '../ui/EstadoVacio.jsx'
import { RiShoppingBagLine } from 'react-icons/ri'

export const GridProductos = ({ productos = [], cargando = false, columnas = 4, accionVacio = null }) => {
    const clasesGrid = {
        2: 'grid-cols-2 sm:grid-cols-2',
        3: 'grid-cols-2 sm:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    }

    if (cargando) {
        return (
            <div className={`grid gap-4 ${clasesGrid[columnas] ?? clasesGrid[4]}`}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonTarjeta key={i} />
                ))}
            </div>
        )
    }

    if (!productos.length) {
        return (
            <EstadoVacio
                icono={<RiShoppingBagLine size={40} className="text-neutral-300" />}
                titulo="Sin productos"
                descripcion="No se encontraron productos con los filtros seleccionados."
                accion={accionVacio}
            />
        )
    }

    return (
        <div className={`grid gap-4 ${clasesGrid[columnas] ?? clasesGrid[4]}`}>
            {productos.map((p) => (
                <TarjetaProducto key={p.id} producto={p} />
            ))}
        </div>
    )
}