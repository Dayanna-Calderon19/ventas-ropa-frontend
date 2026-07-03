import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiArrowRightLine } from 'react-icons/ri'
import { GridProductos } from '../../components/producto/GridProductos.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { useFetch } from '../../hooks/useFetch.js'
import { listarProductos } from '../../services/producto.service.js'
import { listarCategorias } from '../../services/categoria.service.js'

const BannerHero = () => (
  <section className="bg-neutral-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 flex flex-col items-center text-center gap-6">
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400">
        Nueva colección
      </span>
      <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl">
        Moda que define tu estilo
      </h1>
      <p className="text-neutral-400 text-base md:text-lg max-w-md">
        Encuentra prendas únicas para cada ocasión. Envíos a todo el Perú.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Boton
          variante="tierra"
          tamanio="lg"
          icono={<RiArrowRightLine size={18} />}
          iconoDerecha
          onClick={() => (window.location.href = '/catalogo')}
        >
          Ver catálogo
        </Boton>
        <Link to="/registro">
          <Boton variante="secundario" tamanio="lg" className="bg-transparent text-black border-neutral-600 hover:bg-neutral-800 hover:border-neutral-400 hover:text-white">
            Crear cuenta
          </Boton>
        </Link>
      </div>
    </div>
  </section>
)

const SeccionCategorias = ({ categorias, cargando }) => {
  if (cargando) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-neutral-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (!categorias?.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Categorías</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categorias.slice(0, 8).map((cat) => (
          <Link
            key={cat.id}
            to={`/catalogo?categoriaId=${cat.id}`}
            className="flex flex-col items-center justify-center gap-2 h-24 bg-white border border-neutral-200 rounded-lg hover:border-neutral-900 hover:shadow-sm transition-all text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            {cat.imagenUrl && (
              <img src={cat.imagenUrl} alt={cat.nombre} className="w-8 h-8 object-cover rounded" />
            )}
            {cat.nombre}
          </Link>
        ))}
      </div>
    </section>
  )
}

const SeccionBanner = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <div className="bg-[#f5f0e8] rounded-xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-[#a37550] mb-2">
          Oferta especial
        </p>
        <h2 className="text-2xl font-bold text-neutral-900 mb-1">Hasta 40% de descuento</h2>
        <p className="text-sm text-neutral-600">En prendas seleccionadas de temporada.</p>
      </div>
      <Link to="/promociones">
        <Boton variante="tierra" tamanio="lg">
          Ver promociones
        </Boton>
      </Link>
    </div>
  </section>
)

const HomePage = () => {
  const { datos: productosDestacados, cargando: cargandoProductos } = useFetch(
    async () => {
        const respuesta = await listarProductos({ destacado: 'true', limit: 8 });
        return respuesta.data;
    },
    [],
    { datosIniciales: null }
  )

  const { datos: categorias, cargando: cargandoCategorias } = useFetch(
    listarCategorias,
    [],
    { datosIniciales: [] }
  )

  return (
    <div className="flex flex-col">
      <BannerHero />

      <SeccionCategorias categorias={categorias} cargando={cargandoCategorias} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Productos destacados</h2>
          <Link
            to="/catalogo"
            className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
          >
            Ver todos <RiArrowRightLine size={16} />
          </Link>
        </div>
        <GridProductos
          productos={Array.isArray(productosDestacados) ? productosDestacados : []}
          cargando={cargandoProductos}
          columnas={4}
        />
      </section>

      <SeccionBanner />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Últimos ingresos</h2>
          <Link
            to="/catalogo"
            className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
          >
            Ver catálogo <RiArrowRightLine size={16} />
          </Link>
        </div>
        <GridProductos
          productos={Array.isArray(productosDestacados) ? productosDestacados.slice(0, 4) : []}
          cargando={cargandoProductos}
          columnas={4}
        />
      </section>
    </div>
  )
}

export default HomePage