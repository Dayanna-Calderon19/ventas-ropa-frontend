import { Link } from 'react-router-dom'
import { RiHeartLine } from 'react-icons/ri'
import { GridProductos } from '../../components/producto/GridProductos.jsx'
import { EstadoVacio } from '../../components/ui/EstadoVacio.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { useFavoritos } from '../../hooks/useFavoritos.js'

const FavoritosPage = () => {
    const { favoritos } = useFavoritos()

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Mis favoritos</h1>
                <p className="text-sm text-neutral-500 mt-1">
                    {favoritos.length} {favoritos.length === 1 ? 'producto guardado' : 'productos guardados'}
                </p>
            </div>

            {favoritos.length === 0 ? (
                <EstadoVacio
                    icono={<RiHeartLine size={40} className="text-neutral-300" />}
                    titulo="Aún no tienes favoritos"
                    descripcion="Guarda los productos que te gusten tocando el corazón en el catálogo."
                    accion={
                        <Link to="/catalogo">
                            <Boton variante="tierra">Ver catálogo</Boton>
                        </Link>
                    }
                />
            ) : (
                <GridProductos productos={favoritos} cargando={false} columnas={4} />
            )}
        </div>
    )
}

export default FavoritosPage
