import { useState, useEffect } from 'react'
import { RiAddLine, RiEditLine, RiSearchLine, RiShieldUserLine } from 'react-icons/ri'
import { useUsuariosGestion, useMutacionUsuario } from '../../hooks/useUsuarios.js'
import { useFormulario } from '../../hooks/useFormulario.js'
import { useModal } from '../../hooks/useModal.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { CabeceraSeccion } from '../../components/admin/CabeceraSeccion.jsx'
import { TablaBase } from '../../components/admin/TablaBase.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Alerta } from '../../components/ui/Alerta.jsx'
import { Paginacion } from '../../components/ui/Paginacion.jsx'
import { useBusqueda } from '../../hooks/useBusqueda.js'

const validarUsuario = ({ nombre, correo, rol, contrasena }, esEdicion) => {
    const errores = {}
    if (!nombre?.trim()) errores.nombre = 'El nombre es requerido'
    if (!correo?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.correo = 'Correo inválido'
    if (!rol) errores.rol = 'El rol es requerido'
    if (!esEdicion && (!contrasena || contrasena.length < 6)) {
        errores.contrasena = 'La contraseña debe tener al menos 6 caracteres'
    }
    return errores
}

const VALORES_INICIALES = { nombre: '', correo: '', rol: 'VENDEDOR', contrasena: '', activo: true }

const FormUsuario = ({ inicial, onGuardar, cargando, error }) => {
    const { valores, errores, manejarCambio, establecerValores, manejarEnvio } =
        useFormulario(VALORES_INICIALES, (v) => validarUsuario(v, !!inicial))

    useEffect(() => {
        if (inicial) {
            establecerValores({
                nombre: inicial.nombre || '',
                correo: inicial.correo || '',
                rol: inicial.rol || 'VENDEDOR',
                activo: inicial.activo ?? true,
                contrasena: ''
            })
        }
    }, [inicial])

    const manejarSubmit = async (e) => {
        e.preventDefault()
        await manejarEnvio(async (datos) => {
            const payload = { ...datos }
            if (!payload.contrasena) delete payload.contrasena
            await onGuardar(payload)
        })
    }

    return (
        <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
            {error && <Alerta tipo="error" mensaje={error} />}
            <Input label="Nombre completo" name="nombre" value={valores.nombre} onChange={manejarCambio} error={errores.nombre} requerido />
            <Input label="Correo electrónico" type="email" name="correo" value={valores.correo} onChange={manejarCambio} error={errores.correo} requerido />
            <Select
                label="Rol"
                name="rol"
                value={valores.rol}
                onChange={manejarCambio}
                error={errores.rol}
                opciones={[
                    { valor: 'ADMIN', etiqueta: 'Administrador' },
                    { valor: 'VENDEDOR', etiqueta: 'Vendedor' }
                ]}
                requerido
            />
            <Input
                label={inicial ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                type="password"
                name="contrasena"
                value={valores.contrasena}
                onChange={manejarCambio}
                error={errores.contrasena}
                requerido={!inicial}
            />
            <div className="flex justify-end pt-2">
                <Boton type="submit" variante="primario" cargando={cargando}>
                    {inicial ? 'Guardar cambios' : 'Crear usuario'}
                </Boton>
            </div>
        </form>
    )
}

const UsuariosPage = () => {
    const { exito } = useToast()
    const modalForm = useModal('admin_usuario_form')
    const { termino, terminoRetrasado, manejarCambio: manejarBusqueda } = useBusqueda()
    const { datos, meta, cargando, aplicarFiltros, irAPagina, recargar } = useUsuariosGestion()
    const { crearGestion, actualizarGestion, toggleActivoGestion, cargando: mutando, error } = useMutacionUsuario()

    useEffect(() => {
        aplicarFiltros({ busqueda: terminoRetrasado || undefined })
    }, [terminoRetrasado])

    const manejarGuardar = async (datos) => {
        if (modalForm.datos) {
            await actualizarGestion(modalForm.datos.id, datos)
            exito('Usuario actualizado')
        } else {
            await crearGestion(datos)
            exito('Usuario creado')
        }
        modalForm.cerrar()
        recargar()
    }

    const manejarToggleActivo = async (id) => {
        await toggleActivoGestion(id)
        exito('Estado actualizado')
        recargar()
    }

    const columnas = [
        {
            clave: 'nombre', titulo: 'Usuario',
            render: (u) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-neutral-800 flex items-center justify-center text-[#b8933f] text-xs font-bold">
                        {u.nombre.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-neutral-900">{u.nombre}</p>
                        <p className="text-xs text-neutral-400">{u.correo}</p>
                    </div>
                </div>
            )
        },
        {
            clave: 'rol', titulo: 'Rol',
            render: (u) => <Badge variante={u.rol === 'ADMIN' ? 'tierra' : 'info'}>{u.rol}</Badge>
        },
        {
            clave: 'activo', titulo: 'Estado',
            render: (u) => (
                <button onClick={() => manejarToggleActivo(u.id)} disabled={mutando}>
                    <Badge variante={u.activo ? 'exito' : 'error'}>{u.activo ? 'Activo' : 'Inactivo'}</Badge>
                </button>
            )
        },
        {
            clave: 'acciones', titulo: '',
            render: (u) => (
                <div className="flex justify-end">
                    <button
                        onClick={() => modalForm.abrir(u)}
                        className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                    >
                        <RiEditLine size={16} />
                    </button>
                </div>
            )
        }
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <CabeceraSeccion
                titulo="Usuarios del Sistema"
                descripcion="Administra el personal con acceso al panel"
                accion={
                    <Boton variante="primario" icono={<RiAddLine size={16} />} onClick={() => modalForm.abrir(null)}>
                        Nuevo usuario
                    </Boton>
                }
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
                abierto={modalForm.abierto}
                onCerrar={modalForm.cerrar}
                titulo={modalForm.datos ? 'Editar usuario' : 'Nuevo usuario'}
                tamanio="sm"
            >
                <FormUsuario
                    inicial={modalForm.datos}
                    onGuardar={manejarGuardar}
                    cargando={mutando}
                    error={error}
                />
            </Modal>
        </div>
    )
}

export default UsuariosPage
