import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    RiBookOpenLine,
    RiPhoneLine,
    RiMailLine,
    RiMapPinLine,
    RiTimeLine,
    RiShieldCheckLine,
    RiTruckLine,
    RiQuestionLine,
    RiCheckLine,
} from 'react-icons/ri'
import {
    FaInstagram,
    FaFacebookF,
    FaTiktok,
    FaWhatsapp,
    FaCcVisa,
    FaCcMastercard,
    FaCcAmex,
} from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth.js'
import { Modal } from '../ui/Modal.jsx'
import { Input } from '../ui/Input.jsx'
import { Boton } from '../ui/Boton.jsx'

const REDES_SOCIALES = [
    { nombre: 'Instagram', href: '#', Icono: FaInstagram },
    { nombre: 'Facebook', href: '#', Icono: FaFacebookF },
    { nombre: 'TikTok', href: '#', Icono: FaTiktok },
    { nombre: 'WhatsApp', href: 'https://wa.me/51987654321', Icono: FaWhatsapp },
]

export const Footer = () => {
    const { usuario } = useAuth()
    const [modalTipo, setModalTipo] = useState(null) // 'contacto' | 'devoluciones' | 'seguimiento' | null
    const [idPedidoSeguimiento, setIdPedidoSeguimiento] = useState('')
    const [resultadoSeguimiento, setResultadoSeguimiento] = useState(null)
    const [correoNewsletter, setCorreoNewsletter] = useState('')
    const [suscrito, setSuscrito] = useState(false)

    const manejarSuscripcion = (e) => {
        e.preventDefault()
        if (!correoNewsletter.trim()) return
        setSuscrito(true)
        setCorreoNewsletter('')
    }

    const cerrarModal = () => {
        setModalTipo(null)
        setIdPedidoSeguimiento('')
        setResultadoSeguimiento(null)
    }

    const manejarSeguimiento = (e) => {
        e.preventDefault()
        if (!idPedidoSeguimiento.trim()) return

        if (usuario) {
            setResultadoSeguimiento({
                encontrado: true,
                mensaje: `Tu pedido #${idPedidoSeguimiento.toUpperCase().slice(0, 8)} se encuentra en estado PENDIENTE de envío.`,
                ruta: '/cliente/pedidos'
            })
        } else {
            setResultadoSeguimiento({
                encontrado: false,
                mensaje: 'Para ver el detalle completo de tus pedidos, por favor inicia sesión.'
            })
        }
    }

    return (
        <footer className="bg-[#1b2a4a] text-[#9fb0c9] mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="border-b border-white/10 pb-8 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-white font-bold text-lg">Únete a nuestra lista</p>
                        <p className="text-sm mt-1">Recibe ofertas exclusivas y novedades de colección en tu correo.</p>
                    </div>
                    {suscrito ? (
                        <p className="text-sm text-[#b8933f] font-semibold flex items-center gap-2">
                            <RiCheckLine size={18} />
                            ¡Gracias por suscribirte!
                        </p>
                    ) : (
                        <form onSubmit={manejarSuscripcion} className="flex gap-2 w-full sm:w-auto">
                            <Input
                                type="email"
                                placeholder="tu@correo.com"
                                value={correoNewsletter}
                                onChange={(e) => setCorreoNewsletter(e.target.value)}
                                className="sm:w-64"
                                requerido
                            />
                            <Boton type="submit" variante="tierra" className="h-10 shrink-0">
                                Suscribirme
                            </Boton>
                        </form>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
                    <div>
                        <p className="text-white font-bold text-lg mb-3">TIENDA</p>
                        <p className="text-sm leading-relaxed">
                            Moda para todas las ocasiones. Envíos a todo el Perú.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            {REDES_SOCIALES.map(({ nombre, href, Icono }) => (
                                <a
                                    key={nombre}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={nombre}
                                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#b8933f] text-white flex items-center justify-center transition-colors"
                                >
                                    <Icono size={15} />
                                </a>
                            ))}
                        </div>
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
                            <li>
                                <button
                                    onClick={() => setModalTipo('contacto')}
                                    className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none"
                                >
                                    Contacto
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setModalTipo('devoluciones')}
                                    className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none"
                                >
                                    Devoluciones
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setModalTipo('seguimiento')}
                                    className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none"
                                >
                                    Seguimiento de pedido
                                </button>
                            </li>
                            <li className="pt-2 border-t border-white/10">
                                <Link
                                    to="/libro-reclamaciones"
                                    className="hover:text-white transition-colors flex items-center gap-2 text-[#b8933f] font-semibold"
                                >
                                    <RiBookOpenLine size={20} />
                                    Libro de Reclamaciones
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-6 flex flex-col items-center gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-[#9fb0c9]/70 mr-1">Pagos seguros con</span>
                        <span className="w-10 h-7 rounded bg-white flex items-center justify-center">
                            <FaCcVisa size={22} className="text-[#1a1f71]" />
                        </span>
                        <span className="w-10 h-7 rounded bg-white flex items-center justify-center">
                            <FaCcMastercard size={22} />
                        </span>
                        <span className="w-10 h-7 rounded bg-white flex items-center justify-center">
                            <FaCcAmex size={22} className="text-[#2e77bc]" />
                        </span>
                        <span className="px-2.5 h-7 rounded bg-white flex items-center justify-center text-xs font-bold text-[#742284]">Yape</span>
                        <span className="px-2.5 h-7 rounded bg-white flex items-center justify-center text-xs font-bold text-[#00aeef]">Plin</span>
                    </div>
                    <div className="text-xs text-center">
                        © {new Date().getFullYear()} Tienda. Todos los derechos reservados.
                    </div>
                </div>
            </div>

            {/* Modal de Contacto */}
            <Modal
                abierto={modalTipo === 'contacto'}
                cerrar={cerrarModal}
                titulo="Información de Contacto"
            >
                <div className="space-y-4 py-2">
                    <p className="text-sm text-neutral-600">
                        ¿Tienes dudas sobre tu compra o quieres realizar un pedido especial? Ponte en contacto con nosotros:
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-neutral-700">
                            <div className="w-8 h-8 rounded-full bg-[#f5f0e8] text-[#8f7130] flex items-center justify-center flex-shrink-0">
                                <RiPhoneLine size={16} />
                            </div>
                            <div>
                                <p className="font-semibold">Teléfono / WhatsApp</p>
                                <a href="tel:+51987654321" className="text-neutral-500 hover:underline">+51 987 654 321</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-neutral-700">
                            <div className="w-8 h-8 rounded-full bg-[#f5f0e8] text-[#8f7130] flex items-center justify-center flex-shrink-0">
                                <RiMailLine size={16} />
                            </div>
                            <div>
                                <p className="font-semibold">Correo Electrónico</p>
                                <a href="mailto:soporte@modajelu.com" className="text-neutral-500 hover:underline">soporte@modajelu.com</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-neutral-700">
                            <div className="w-8 h-8 rounded-full bg-[#f5f0e8] text-[#8f7130] flex items-center justify-center flex-shrink-0">
                                <RiMapPinLine size={16} />
                            </div>
                            <div>
                                <p className="font-semibold">Dirección Principal</p>
                                <p className="text-neutral-500">Av. Larco 123, Miraflores, Lima, Perú</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-neutral-700">
                            <div className="w-8 h-8 rounded-full bg-[#f5f0e8] text-[#8f7130] flex items-center justify-center flex-shrink-0">
                                <RiTimeLine size={16} />
                            </div>
                            <div>
                                <p className="font-semibold">Horario de Atención</p>
                                <p className="text-neutral-500">Lunes a Sábado: 9:00 AM - 7:00 PM</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-neutral-100 flex justify-end">
                        <Boton onClick={cerrarModal} variante="tierra" tamanio="sm">Entendido</Boton>
                    </div>
                </div>
            </Modal>

            {/* Modal de Devoluciones */}
            <Modal
                abierto={modalTipo === 'devoluciones'}
                cerrar={cerrarModal}
                titulo="Políticas de Devolución"
            >
                <div className="space-y-4 py-2">
                    <p className="text-sm text-neutral-600">
                        Queremos que ames tu compra. Si no estás conforme, revisa nuestras condiciones de devolución:
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 text-sm text-neutral-700">
                            <RiShieldCheckLine size={18} className="text-[#8f7130] mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Plazo Máximo</p>
                                <p className="text-neutral-500 text-xs">Hasta 7 días hábiles después de haber recibido tu pedido.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-neutral-700">
                            <RiShieldCheckLine size={18} className="text-[#8f7130] mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Estado del Producto</p>
                                <p className="text-neutral-500 text-xs">Debe encontrarse en perfectas condiciones, con etiquetas originales y sin señales de uso.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-neutral-700">
                            <RiShieldCheckLine size={18} className="text-[#8f7130] mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Proceso de Retorno</p>
                                <p className="text-neutral-500 text-xs">Escríbenos a soporte@modajelu.com o envíanos un WhatsApp adjuntando tu boleta/comprobante de compra.</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-neutral-100 flex justify-end">
                        <Boton onClick={cerrarModal} variante="tierra" tamanio="sm">Cerrar</Boton>
                    </div>
                </div>
            </Modal>

            {/* Modal de Seguimiento de pedido */}
            <Modal
                abierto={modalTipo === 'seguimiento'}
                cerrar={cerrarModal}
                titulo="Seguimiento de Pedido"
            >
                <form onSubmit={manejarSeguimiento} className="space-y-4 py-2">
                    <p className="text-sm text-neutral-600">
                        Ingresa el código único de tu pedido para consultar su estado en tiempo real:
                    </p>

                    <div className="flex gap-2 items-end">
                        <Input
                            placeholder="Ej. d3b07384d113"
                            value={idPedidoSeguimiento}
                            onChange={(e) => setIdPedidoSeguimiento(e.target.value)}
                            className="flex-1"
                            requerido
                        />
                        <Boton type="submit" variante="tierra" className="h-10">
                            Buscar
                        </Boton>
                    </div>

                    {resultadoSeguimiento && (
                        <div className={`p-3 rounded-lg border text-xs flex gap-2.5 items-start ${
                            resultadoSeguimiento.encontrado
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}>
                            {resultadoSeguimiento.encontrado ? (
                                <RiTruckLine size={16} className="mt-0.5 flex-shrink-0" />
                            ) : (
                                <RiQuestionLine size={16} className="mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                                <p className="font-medium">{resultadoSeguimiento.mensaje}</p>
                                {resultadoSeguimiento.ruta && (
                                    <Link
                                        to={resultadoSeguimiento.ruta}
                                        onClick={cerrarModal}
                                        className="inline-block mt-1 underline font-semibold hover:no-underline"
                                    >
                                        Ir a mis pedidos
                                    </Link>
                                )}
                                {!resultadoSeguimiento.encontrado && (
                                    <Link
                                        to="/login"
                                        onClick={cerrarModal}
                                        className="inline-block mt-1 underline font-semibold hover:no-underline"
                                    >
                                        Iniciar sesión
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </form>
            </Modal>
        </footer>
    )
}