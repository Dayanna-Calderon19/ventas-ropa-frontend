import { Link } from 'react-router-dom'

export const Footer = () => {
    return (
        <footer className="bg-neutral-900 text-neutral-400 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
                    <div>
                        <p className="text-white font-bold text-lg mb-3">TIENDA</p>
                        <p className="text-sm leading-relaxed">
                            Moda para todas las ocasiones. Envíos a todo el Perú.
                        </p>
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold mb-3">Navegación</p>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link to="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
                            <li><Link to="/promociones" className="hover:text-white transition-colors">Promociones</Link></li>
                            <li><Link to="/registro" className="hover:text-white transition-colors">Crear cuenta</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold mb-3">Ayuda</p>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><span className="hover:text-white transition-colors cursor-pointer">Contacto</span></li>
                            <li><span className="hover:text-white transition-colors cursor-pointer">Devoluciones</span></li>
                            <li><span className="hover:text-white transition-colors cursor-pointer">Seguimiento de pedido</span></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-neutral-800 pt-6 text-xs text-center">
                    © {new Date().getFullYear()} Tienda. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    )
}