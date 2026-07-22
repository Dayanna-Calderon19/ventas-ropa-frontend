import { useState, useEffect } from 'react'
import { RiUserLine, RiSettings3Line, RiLockPasswordLine, RiSaveLine } from 'react-icons/ri'
import { useAuth } from '../../hooks/useAuth.js'
import { useMutacionUsuario } from '../../hooks/useUsuarios.js'
import { useFormulario } from '../../hooks/useFormulario.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { CabeceraSeccion } from '../../components/admin/CabeceraSeccion.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Alerta } from '../../components/ui/Alerta.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { cambiarContrasena } from '../../services/auth.service.js'

const validarPerfil = ({ nombre, correo, telefono }) => {
    const errores = {}
    if (!nombre?.trim()) errores.nombre = 'El nombre es requerido'
    if (!correo?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.correo = 'Correo inválido'
    if (telefono && !/^\d{0,9}$/.test(telefono)) errores.telefono = 'El teléfono debe ser numérico y tener máximo 9 dígitos'
    return errores
}

const ConfiguracionPage = () => {
    const { usuario, setUsuario } = useAuth()
    const { exito, error: mostrarError } = useToast()
    const { actualizarMiPerfil, cargando, error } = useMutacionUsuario()
    const [modalAbierto, setModalAbierto] = useState(false)
    const [contrasena, setContrasena] = useState({ actual: '', nueva: '' })

    const { valores, errores, manejarCambio, establecerValores, manejarEnvio, enviando } = useFormulario({
        nombre: '',
        correo: '',
        telefono: ''
    }, validarPerfil)

    useEffect(() => {
        if (usuario) {
            establecerValores({
                nombre: usuario.nombre || '',
                correo: usuario.correo || '',
                telefono: usuario.telefono || ''
            })
        }
    }, [usuario])

    const manejarGuardarPerfil = async (e) => {
        e.preventDefault()
        await manejarEnvio(async (datos) => {
            const perfilActualizado = await actualizarMiPerfil(datos)
            setUsuario(perfilActualizado) // Update context
            exito('Perfil actualizado correctamente')
        })
    }

    const manejarCambioContrasena = async () => {
        try {
            await cambiarContrasena({ contrasenaActual: contrasena.actual, contrasenaNueva: contrasena.nueva })
            exito('Contraseña actualizada correctamente')
            setModalAbierto(false)
            setContrasena({ actual: '', nueva: '' })
        } catch (err) {
            mostrarError(err.response?.data?.message || 'Error al cambiar contraseña')
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <CabeceraSeccion
                titulo="Configuración"
                descripcion="Administra tu cuenta y preferencias del sistema"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                            <RiUserLine className="text-[#b8933f]" size={20} />
                            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Mi Perfil</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={manejarGuardarPerfil} className="space-y-4">
                                {error && <Alerta tipo="error" mensaje={error} />}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Nombre completo" name="nombre" value={valores.nombre} onChange={manejarCambio} error={errores.nombre} requerido />
                                    <Input label="Correo electrónico" type="email" name="correo" value={valores.correo} onChange={manejarCambio} error={errores.correo} requerido />
                                </div>
                                <Input 
                                    label="Teléfono" 
                                    name="telefono" 
                                    type="tel"
                                    maxLength={9}
                                    value={valores.telefono} 
                                    onChange={(e) => {
                                        const soloNumeros = e.target.value.replace(/\D/g, '');
                                        manejarCambio({ target: { name: 'telefono', value: soloNumeros } });
                                    }} 
                                    error={errores.telefono} 
                                />
                                <div className="flex justify-end pt-2">
                                    <Boton type="submit" variante="primario" cargando={enviando} icono={<RiSaveLine size={16} />}>
                                        Guardar Perfil
                                    </Boton>
                                </div>
                            </form>
                        </div>
                    </section>

                    <section className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                            <RiLockPasswordLine className="text-[#b8933f]" size={20} />
                            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Seguridad</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-neutral-500 mb-4">Cambia tu contraseña periódicamente para mantener tu cuenta segura.</p>
                            <Boton variante="secundario" onClick={() => setModalAbierto(true)}>Cambiar Contraseña</Boton>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-neutral-900 text-white rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#b8933f] flex items-center justify-center text-white text-lg font-bold">
                                {usuario?.nombre?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold">{usuario?.nombre}</p>
                                <Badge variante="tierra">{usuario?.rol}</Badge>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-neutral-400">
                            <p className="flex justify-between"><span>Estado:</span> <span className="text-green-400 font-medium">Conectado</span></p>
                            <p className="flex justify-between"><span>ID de Usuario:</span> <span className="font-mono text-[10px]">{usuario?.id}</span></p>
                        </div>
                    </section>
                </div>
            </div>

            <Modal abierto={modalAbierto} cerrar={() => setModalAbierto(false)} titulo="Cambiar Contraseña">
                <div className="space-y-4">
                    <Input label="Contraseña actual" type="password" value={contrasena.actual} onChange={(e) => setContrasena(prev => ({...prev, actual: e.target.value}))} />
                    <Input label="Nueva contraseña" type="password" value={contrasena.nueva} onChange={(e) => setContrasena(prev => ({...prev, nueva: e.target.value}))} />
                    <Boton variante="primario" onClick={manejarCambioContrasena}>Actualizar Contraseña</Boton>
                </div>
            </Modal>
        </div>
    )
}

export default ConfiguracionPage
