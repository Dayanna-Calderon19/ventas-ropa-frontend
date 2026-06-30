import { useState, useEffect } from 'react'
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiSearchLine } from 'react-icons/ri'
import { useCategoriasPaginadas, useMutacionCategoria } from '../../hooks/useCategorias.js'
import { useFormulario } from '../../hooks/useFormulario.js'
import { useModal } from '../../hooks/useModal.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { CabeceraSeccion } from '../../components/admin/CabeceraSeccion.jsx'
import { TablaBase } from '../../components/admin/TablaBase.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Alerta } from '../../components/ui/Alerta.jsx'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx'
import { Paginacion } from '../../components/ui/Paginacion.jsx'
import { useBusqueda } from '../../hooks/useBusqueda.js'

const validarCategoria = ({ nombre }) => {
    const errores = {}
    if (!nombre?.trim()) errores.nombre = 'El nombre es requerido'
    return errores
}

const VALORES_INICIALES = { nombre: '', descripcion: '', imagenUrl: '', activo: true }

const FormCategoria = ({ inicial, onGuardar, cargando, error }) => {
    const { valores, errores, manejarCambio, establecerValores, manejarEnvio } =
        useFormulario(VALORES_INICIALES, validarCategoria)

    useEffect(() => {
        if (inicial) {
            establecerValores({
                nombre: inicial.nombre || '',
                descripcion: inicial.descripcion || '',
                imagenUrl: inicial.imagenUrl || '',
                activo: inicial.activo ?? true,
            })
        }
    }, [inicial])

    const manejarSubmit = async (e) => {
        e.preventDefault()
        await manejarEnvio(async (datos) => {
            await onGuardar(datos)
        })
    }

    return (
        <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
            {error && <Alerta tipo="error" mensaje={error} />}
            <Input label="Nombre" name="nombre" value={valores.nombre} onChange={manejarCambio} error={errores.nombre} requerido />
            <Input label="URL de imagen" name="imagenUrl" value={valores.imagenUrl} onChange={manejarCambio} placeholder="https://..." />
            <textarea
                name="descripcion"
                value={valores.descripcion}
                onChange={manejarCambio}
                placeholder="Descripción de la categoría..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none placeholder-neutral-400"
            />
            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                <input type="checkbox" name="activo" checked={valores.activo} onChange={manejarCambio} className="rounded" />
                Categoría activa
            </label>
            <div className="flex justify-end pt-2">
                <Boton type="submit" variante="primario" cargando={cargando}>
                    {inicial ? 'Guardar cambios' : 'Crear categoría'}
                </Boton>
            </div>
        </form>
    )
}

const CategoriasPage = () => {
    const { exito } = useToast()
    const modalForm = useModal('admin_categoria_form')
    const modalEliminar = useModal('admin_categoria_eliminar')
    const { termino, terminoRetrasado, manejarCambio: manejarBusqueda } = useBusqueda()
    const { datos, meta, cargando, aplicarFiltros, irAPagina, recargar } = useCategoriasPaginadas()
    const { crear, actualizar, eliminar, cargando: mutando, error } = useMutacionCategoria()

    useEffect(() => {
        aplicarFiltros({ busqueda: terminoRetrasado || undefined })
    }, [terminoRetrasado])

    const manejarGuardar = async (datos) => {
        if (modalForm.datos) {
            await actualizar(modalForm.datos.id, datos)
            exito('Categoría actualizada')
        } else {
            await crear(datos)
            exito('Categoría creada')
        }
        modalForm.cerrar()
        recargar()
    }

    const manejarEliminar = async () => {
        await eliminar(modalEliminar.datos.id)
        exito('Categoría eliminada')
        modalEliminar.cerrar()
        recargar()
    }

    const columnas = [
        {
            clave: 'nombre', titulo: 'Categoría',
            render: (c) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                        {c.imagenUrl
                            ? <img src={c.imagenUrl} alt={c.nombre} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-bold">{c.nombre.charAt(0)}</div>}
                    </div>
                    <div>
                        <p className="font-medium text-neutral-900">{c.nombre}</p>
                        <p className="text-xs text-neutral-400">{c.slug}</p>
                    </div>
                </div>
            ),
        },
        {
            clave: 'productos', titulo: 'Productos',
            render: (c) => <span>{c._count?.productos ?? 0} items</span>
        },
        {
            clave: 'activo', titulo: 'Estado',
            render: (c) => <Badge variante={c.activo ? 'exito' : 'error'}>{c.activo ? 'Activo' : 'Inactivo'}</Badge>,
        },
        {
            clave: 'acciones', titulo: '',
            render: (c) => (
                <div className="flex items-center gap-2 justify-end">
                    <button onClick={(e) => { e.stopPropagation(); modalForm.abrir(c) }} className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
                        <RiEditLine size={15} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); modalEliminar.abrir(c) }} className="p-1.5 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <RiDeleteBinLine size={15} />
                    </button>
                </div>
            ),
        },
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <CabeceraSeccion
                titulo="Categorías"
                descripcion="Organiza tus productos por grupos"
                accion={
                    <Boton variante="primario" icono={<RiAddLine size={16} />} onClick={() => modalForm.abrir(null)}>
                        Nueva categoría
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
                            placeholder="Buscar categorías..."
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
                titulo={modalForm.datos ? 'Editar categoría' : 'Nueva categoría'}
                tamanio="sm"
            >
                <FormCategoria
                    inicial={modalForm.datos}
                    onGuardar={manejarGuardar}
                    cargando={mutando}
                    error={error}
                />
            </Modal>

            <ConfirmDialog
                abierto={modalEliminar.abierto}
                titulo="Eliminar categoría"
                mensaje={`¿Estás seguro de eliminar "${modalEliminar.datos?.nombre}"? Esta acción no se puede deshacer.`}
                textoConfirmar="Eliminar"
                variante="peligro"
                cargando={mutando}
                onCancelar={modalEliminar.cerrar}
                onConfirmar={manejarEliminar}
            />
        </div>
    )
}

export default CategoriasPage
