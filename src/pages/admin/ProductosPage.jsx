import { useState } from 'react'
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiSearchLine } from 'react-icons/ri'
import { useProductos, useCategorias, useMutacionProducto } from '../../hooks/useProductos.js'
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
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx'
import { Paginacion } from '../../components/ui/Paginacion.jsx'
import { useBusqueda } from '../../hooks/useBusqueda.js'
import { formatearMoneda } from '../../utils/formato.js'
import { useEffect } from 'react'

const validarProducto = ({ nombre, precioBase, categoriaId }) => {
    const errores = {}
    if (!nombre?.trim() || nombre.trim().length < 2) errores.nombre = 'El nombre es requerido'
    if (!precioBase || isNaN(precioBase) || Number(precioBase) < 0) errores.precioBase = 'El precio es requerido'
    if (!categoriaId) errores.categoriaId = 'La categoría es requerida'
    return errores
}

const VALORES_INICIALES = { nombre: '', descripcion: '', precioBase: '', categoriaId: '', destacado: false, imagenUrl: '' }

const FormProducto = ({ inicial, onGuardar, cargando, error }) => {
    const { datos: categorias } = useCategorias()
    const { valores, errores, manejarCambio, establecerValores, manejarEnvio } =
        useFormulario(VALORES_INICIALES, validarProducto)

    useEffect(() => {
        if (inicial) {
            establecerValores({
                nombre: inicial.nombre || '',
                descripcion: inicial.descripcion || '',
                precioBase: inicial.precioBase ?? '',
                categoriaId: inicial.categoriaId || '',
                destacado: inicial.destacado || false,
                imagenUrl: inicial.imagenUrl || '',
            })
        }
    }, [inicial])

    const manejarSubmit = async (e) => {
        e.preventDefault()
        await manejarEnvio(async (datos) => {
            await onGuardar({
                ...datos,
                precioBase: parseFloat(datos.precioBase),
                destacado: !!datos.destacado,
                imagenUrl: datos.imagenUrl || undefined,
                descripcion: datos.descripcion || undefined,
            })
        })
    }

    return (
        <form onSubmit={manejarSubmit} className="flex flex-col gap-4" noValidate>
            {error && <Alerta tipo="error" mensaje={error} />}
            <Input label="Nombre" name="nombre" value={valores.nombre} onChange={manejarCambio} error={errores.nombre} requerido />
            <div className="grid grid-cols-2 gap-4">
                <Input label="Precio base (S/)" type="number" name="precioBase" value={valores.precioBase} onChange={manejarCambio} error={errores.precioBase} requerido />
                <Select
                    label="Categoría"
                    name="categoriaId"
                    value={valores.categoriaId}
                    onChange={manejarCambio}
                    error={errores.categoriaId}
                    opciones={(categorias ?? []).map((c) => ({ valor: c.id, etiqueta: c.nombre }))}
                    requerido
                />
            </div>
            <Input label="URL de imagen" name="imagenUrl" value={valores.imagenUrl} onChange={manejarCambio} placeholder="https://..." />
            <textarea
                name="descripcion"
                value={valores.descripcion}
                onChange={manejarCambio}
                placeholder="Descripción del producto..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none placeholder-neutral-400"
            />
            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                <input type="checkbox" name="destacado" checked={valores.destacado} onChange={manejarCambio} className="rounded" />
                Marcar como destacado
            </label>
            <div className="flex justify-end gap-3 pt-2">
                <Boton type="submit" variante="primario" cargando={cargando}>
                    {inicial ? 'Guardar cambios' : 'Crear producto'}
                </Boton>
            </div>
        </form>
    )
}

const ProductosPage = () => {
    const { exito } = useToast()
    const modalForm = useModal('admin_producto_form')
    const modalEliminar = useModal('admin_producto_eliminar')
    const { termino, terminoRetrasado, manejarCambio: manejarBusqueda } = useBusqueda()
    const { datos, meta, cargando, aplicarFiltros, irAPagina, recargar } = useProductos()
    const { crear, actualizar, eliminar, cargando: mutando, error } = useMutacionProducto()

    useEffect(() => {
        aplicarFiltros({ busqueda: terminoRetrasado || undefined })
    }, [terminoRetrasado])

    const manejarGuardar = async (datos) => {
        if (modalForm.datos) {
            await actualizar(modalForm.datos.id, datos)
            exito('Producto actualizado')
        } else {
            await crear(datos)
            exito('Producto creado')
        }
        modalForm.cerrar()
        recargar()
    }

    const manejarEliminar = async () => {
        await eliminar(modalEliminar.datos.id)
        exito('Producto desactivado')
        modalEliminar.cerrar()
        recargar()
    }

    const columnas = [
        {
            clave: 'nombre', titulo: 'Producto',
            render: (p) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-10 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                        {p.imagenUrl
                            ? <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-neutral-200" />}
                    </div>
                    <div>
                        <p className="font-medium text-neutral-900">{p.nombre}</p>
                        <p className="text-xs text-neutral-400">{p.categoria?.nombre}</p>
                    </div>
                </div>
            ),
        },
        { clave: 'precioBase', titulo: 'Precio base', render: (p) => formatearMoneda(p.precioBase) },
        {
            clave: 'variantes', titulo: 'Stock total',
            render: (p) => {
                const total = p.variantes?.reduce((a, v) => a + v.stock, 0) ?? 0
                return <span className={total === 0 ? 'text-red-600 font-medium' : ''}>{total} uds</span>
            },
        },
        {
            clave: 'destacado', titulo: 'Destacado',
            render: (p) => p.destacado ? <Badge variante="tierra">Sí</Badge> : <span className="text-neutral-400 text-xs">No</span>,
        },
        {
            clave: 'activo', titulo: 'Estado',
            render: (p) => <Badge variante={p.activo ? 'exito' : 'error'}>{p.activo ? 'Activo' : 'Inactivo'}</Badge>,
        },
        {
            clave: 'acciones', titulo: '',
            render: (p) => (
                <div className="flex items-center gap-2 justify-end">
                    <button onClick={(e) => { e.stopPropagation(); modalForm.abrir(p) }} className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
                        <RiEditLine size={15} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); modalEliminar.abrir(p) }} className="p-1.5 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <RiDeleteBinLine size={15} />
                    </button>
                </div>
            ),
        },
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <CabeceraSeccion
                titulo="Productos"
                descripcion="Administra el catálogo de la tienda"
                accion={
                    <Boton variante="primario" icono={<RiAddLine size={16} />} onClick={() => modalForm.abrir(null)}>
                        Nuevo producto
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
                            placeholder="Buscar productos..."
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
                titulo={modalForm.datos ? 'Editar producto' : 'Nuevo producto'}
                tamanio="md"
            >
                <FormProducto
                    inicial={modalForm.datos}
                    onGuardar={manejarGuardar}
                    cargando={mutando}
                    error={error}
                />
            </Modal>

            <ConfirmDialog
                abierto={modalEliminar.abierto}
                titulo="Desactivar producto"
                mensaje={`¿Desactivar "${modalEliminar.datos?.nombre}"? Dejará de mostrarse en la tienda.`}
                textoConfirmar="Desactivar"
                cargando={mutando}
                onCancelar={modalEliminar.cerrar}
                onConfirmar={manejarEliminar}
            />
        </div>
    )
}

export default ProductosPage