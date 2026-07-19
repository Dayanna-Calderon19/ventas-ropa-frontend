import { useState, useEffect } from 'react'
import { RiSearchLine, RiEyeLine, RiUserLine, RiEditLine, RiDeleteBinLine, RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri'
import { useUsuarios, useMutacionUsuario } from '../../hooks/useUsuarios.js'
import { obtenerCliente } from '../../services/cliente.service.js'
import { CabeceraSeccion } from '../../components/admin/CabeceraSeccion.jsx'
import { TablaBase } from '../../components/admin/TablaBase.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useModal } from '../../hooks/useModal.js'
import { useBusqueda } from '../../hooks/useBusqueda.js'
import { Paginacion } from '../../components/ui/Paginacion.jsx'
import { formatearFecha } from '../../utils/formato.js'

const DetalleCliente = ({ clienteId }) => {
    const [cliente, setCliente] = useState(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        if (clienteId) {
            setCargando(true)
            obtenerCliente(clienteId)
                .then(data => setCliente(data))
                .catch(err => console.error(err))
                .finally(() => setCargando(false))
        }
    }, [clienteId])

    if (cargando) return <p className="text-sm text-neutral-500">Cargando detalles...</p>
    if (!cliente) return <p className="text-sm text-red-500">No se pudo cargar el cliente.</p>

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-[#c4956a]">
                    <RiUserLine size={32} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-neutral-900">{cliente.nombre}</h3>
                    <p className="text-sm text-neutral-500">{cliente.correo}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-neutral-50 rounded-lg">
                    <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Teléfono</p>
                    <p className="text-sm font-medium">{cliente.telefono || 'No registrado'}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                    <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Cliente desde</p>
                    <p className="text-sm font-medium">{formatearFecha(cliente.creadoEn)}</p>
                </div>
            </div>

            {cliente.perfil && (
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-neutral-900">Dirección de envío</p>
                    <div className="p-3 border border-neutral-100 rounded-lg text-sm text-neutral-600">
                        <p>{cliente.perfil.direccion || 'Sin dirección'}</p>
                        <p>{cliente.perfil.distrito}, {cliente.perfil.ciudad}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-neutral-900">Historial de pedidos ({cliente._count?.pedidos || 0})</p>
                {cliente.pedidos?.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {cliente.pedidos.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-2 border-b border-neutral-50 text-xs">
                                <span>{formatearFecha(p.creadoEn)}</span>
                                <span className="font-bold">{p.total} S/</span>
                                <Badge variante={p.estado === 'ENTREGADO' ? 'exito' : 'info'}>{p.estado}</Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-neutral-400 italic">No hay pedidos registrados</p>
                )}
            </div>
        </div>
    )
}

const FormCliente = ({ inicial, onGuardar, cargando, error }) => {
    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [telefono, setTelefono] = useState('')
    const [errores, setErrores] = useState({})

    useEffect(() => {
        if (inicial) {
            setNombre(inicial.nombre || '')
            setCorreo(inicial.correo || '')
            setTelefono(inicial.telefono || '')
        }
    }, [inicial])

    const validar = () => {
        const err = {}
        if (!nombre.trim()) err.nombre = 'El nombre es requerido'
        if (!correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) err.correo = 'Correo inválido'
        return err
    }

    const manejarSubmit = (e) => {
        e.preventDefault()
        const err = validar()
        if (Object.keys(err).length > 0) {
            setErrores(err)
            return
        }
        setErrores({})
        onGuardar({ nombre, correo, telefono, rol: 'CLIENTE' })
    }

    return (
        <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs">{error}</div>}
            <Input label="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} error={errores.nombre} requerido />
            <Input label="Correo electrónico" type="email" value={correo} onChange={e => setCorreo(e.target.value)} error={errores.correo} requerido />
            <Input
                label="Teléfono"
                type="tel"
                maxLength={9}
                value={telefono}
                onChange={(e) => {
                    const soloNumeros = e.target.value.replace(/\D/g, '');
                    setTelefono(soloNumeros);
                }}
            />
            <div className="flex justify-end pt-2">
                <Boton type="submit" variante="primario" cargando={cargando}>
                    Guardar cambios
                </Boton>
            </div>
        </form>
    )
}

const ClientesPage = () => {
    const { exito } = useToast()
    const modalDetalle = useModal('admin_cliente_detalle')
    const modalEditar = useModal('admin_cliente_editar')
    const { termino, terminoRetrasado, manejarCambio: manejarBusqueda } = useBusqueda()
    const { datos, meta, cargando, aplicarFiltros, irAPagina, recargar } = useUsuarios({ rol: 'CLIENTE' })
    const { toggleActivo, actualizarGestion, cargando: mutando } = useMutacionUsuario()
    const [errorEdicion, setErrorEdicion] = useState(null)

    useEffect(() => {
        aplicarFiltros({ busqueda: terminoRetrasado || undefined })
    }, [terminoRetrasado])

    const manejarToggleActivo = async (id) => {
        await toggleActivo(id)
        recargar()
    }

    const manejarGuardarEdicion = async (datosEdicion) => {
        try {
            setErrorEdicion(null)
            await actualizarGestion(modalEditar.datos.id, datosEdicion)
            exito('Cliente actualizado correctamente')
            modalEditar.cerrar()
            recargar()
        } catch (err) {
            setErrorEdicion(err.response?.data?.message || 'Error al actualizar el cliente')
        }
    }

    const columnas = [
        {
            clave: 'nombre', titulo: 'Cliente',
            render: (c) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 font-bold">
                        {c.nombre.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-neutral-900">{c.nombre}</p>
                        <p className="text-xs text-neutral-400">{c.correo}</p>
                    </div>
                </div>
            )
        },
        { clave: 'telefono', titulo: 'Teléfono' },
        {
            clave: 'pedidos', titulo: 'Pedidos',
            render: (c) => <span className="text-xs font-medium">{c._count?.pedidos ?? 0}</span>
        },
        {
            clave: 'activo', titulo: 'Estado',
            render: (c) => (
                <button
                    onClick={(e) => { e.stopPropagation(); manejarToggleActivo(c.id) }}
                    disabled={mutando}
                    className="flex items-center gap-1"
                >
                    {c.activo ? <RiCheckboxCircleLine className="text-green-500" size={16}/> : <RiCloseCircleLine className="text-red-500" size={16}/>}
                    <Badge variante={c.activo ? 'exito' : 'error'}>{c.activo ? 'Activo' : 'Inactivo'}</Badge>
                </button>
            )
        },
        {
            clave: 'acciones', titulo: '',
            render: (c) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => modalDetalle.abrir(c.id)}
                        className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        title="Ver detalles"
                    >
                        <RiEyeLine size={16} />
                    </button>
                    <button
                        onClick={() => modalEditar.abrir(c)}
                        className="p-1.5 rounded text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Editar"
                    >
                        <RiEditLine size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); manejarToggleActivo(c.id) }}
                        className="p-1.5 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title={c.activo ? 'Desactivar' : 'Activar'}
                    >
                        <RiDeleteBinLine size={16} />
                    </button>
                </div>
            )
        }
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <CabeceraSeccion
                titulo="Clientes"
                descripcion="Gestiona la base de datos de tus compradores"
            />

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
                    <div className="flex-1">
                        <Input
                            type="text"
                            value={termino}
                            onChange={manejarBusqueda}
                            placeholder="Buscar por nombre o correo..."
                            icono={<RiSearchLine size={15} />}
                        />
                    </div>
                </div>

                <TablaBase columnas={columnas} filas={datos ?? []} cargando={cargando} />

                {meta && meta.totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-neutral-100">
                        <Paginacion meta={meta} onCambiarPagina={irAPagina} />
                    </div>
                )}
            </div>

            <Modal
                abierto={modalDetalle.abierto}
                cerrar={modalDetalle.cerrar}
                titulo="Detalle del Cliente"
                tamanio="sm"
            >
                <DetalleCliente clienteId={modalDetalle.datos} />
            </Modal>

            <Modal
                abierto={modalEditar.abierto}
                cerrar={modalEditar.cerrar}
                titulo="Editar Cliente"
                tamanio="sm"
            >
                <FormCliente
                    inicial={modalEditar.datos}
                    onGuardar={manejarGuardarEdicion}
                    cargando={mutando}
                    error={errorEdicion}
                />
            </Modal>
        </div>
    )
}

export default ClientesPage
