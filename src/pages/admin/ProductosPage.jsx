import { useState, useEffect } from 'react'
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

const validarProducto = ({ nombre, precioBase, categoriaId, variantes }) => {
    const errores = {}
    if (!nombre?.trim() || nombre.trim().length < 2) errores.nombre = 'El nombre es requerido'
    if (!precioBase || isNaN(precioBase) || Number(precioBase) < 0) errores.precioBase = 'El precio es requerido'
    if (!categoriaId) errores.categoriaId = 'La categoría es requerida'
    if (!variantes || variantes.length === 0) errores.variantes = 'Debe agregar al menos una variante'
    return errores
}

const VALORES_INICIALES = { nombre: '', descripcion: '', precioBase: '', categoriaId: '', destacado: false, imagenUrl: '', variantes: [] }

const FormProducto = ({ inicial, onGuardar, cargando, error }) => {
    const { datos: categorias } = useCategorias()
    const { valores, errores, manejarCambio, establecerValores, manejarEnvio } =
        useFormulario(VALORES_INICIALES, validarProducto)
    const [nuevaVariante, setNuevaVariante] = useState({ talla: '', color: '', precio: '', stock: '' })
    const [indiceEdicion, setIndiceEdicion] = useState(null)

    useEffect(() => {
        if (inicial) {
            establecerValores({
                nombre: inicial.nombre || '',
                descripcion: inicial.descripcion || '',
                precioBase: inicial.precioBase ?? '',
                categoriaId: inicial.categoriaId || '',
                destacado: inicial.destacado || false,
                imagenUrl: inicial.imagenUrl || '',
                variantes: inicial.variantes || [],
            })
        }
    }, [inicial])

    const generarSku = (talla, color) => {
        const base = valores.nombre.substring(0, 3).toUpperCase()
        const t = talla.substring(0, 2).toUpperCase()
        const c = color.substring(0, 2).toUpperCase()
        return `${base}-${t}-${c}-${Math.floor(Math.random() * 1000)}`
    }

    const agregarVariante = () => {
        if (!nuevaVariante.talla || !nuevaVariante.color) return
        
        const varianteFinal = {
            ...nuevaVariante,
            sku: generarSku(nuevaVariante.talla, nuevaVariante.color),
            precio: nuevaVariante.precio ? parseFloat(nuevaVariante.precio) : undefined,
            stock: parseInt(nuevaVariante.stock || 0)
        }

        if (indiceEdicion !== null) {
            const nuevasVariantes = [...valores.variantes]
            nuevasVariantes[indiceEdicion] = varianteFinal
            establecerValores({ ...valores, variantes: nuevasVariantes })
            setIndiceEdicion(null)
        } else {
            establecerValores({
                ...valores,
                variantes: [...valores.variantes, varianteFinal]
            })
        }
        setNuevaVariante({ talla: '', color: '', precio: '', stock: '' })
    }

    const iniciarEdicion = (index) => {
        setNuevaVariante({
            talla: valores.variantes[index].talla,
            color: valores.variantes[index].color,
            precio: valores.variantes[index].precio || '',
            stock: valores.variantes[index].stock
        })
        setIndiceEdicion(index)
    }

    const eliminarVariante = (index) => {
        establecerValores({ ...valores, variantes: valores.variantes.filter((_, i) => i !== index) })
        if (indiceEdicion === index) {
            setIndiceEdicion(null)
            setNuevaVariante({ talla: '', color: '', precio: '', stock: '' })
        }
    }

    const manejarSubmit = async (e) => {
        e.preventDefault()
        await manejarEnvio(async (datos) => {
            await onGuardar({
                ...datos,
                precioBase: parseFloat(datos.precioBase),
                destacado: !!datos.destacado,
                imagenUrl: datos.imagenUrl || undefined,
                descripcion: datos.descripcion || undefined,
                variantes: datos.variantes.map(v => ({ 
                    ...v, 
                    precio: v.precio ? parseFloat(v.precio) : undefined, 
                    stock: parseInt(v.stock) 
                }))
            })
        })
    }

    return (
        <form onSubmit={manejarSubmit} className="flex flex-col gap-2" noValidate>
            {error && <Alerta tipo="error" mensaje={error} />}
            <Input label="Nombre" name="nombre" value={valores.nombre} onChange={manejarCambio} error={errores.nombre} requerido />
            <div className="grid grid-cols-2 gap-2">
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
            
            <div className="border-t pt-4">
                <h3 className="font-medium text-sm mb-2">Variantes y Stock</h3>
                {errores.variantes && <p className="text-red-500 text-xs mb-2">{errores.variantes}</p>}
                
                <div className="max-h-24 overflow-y-auto mb-2 border border-neutral-100 rounded">
                    {valores.variantes.map((v) => (
                        <div key={v.sku} className="flex items-center gap-2 p-1 text-xs bg-neutral-50 border-b border-neutral-100">
                            <span className="flex-1">{v.sku} - {v.talla} - {v.color} - {v.precio || 'Base'} - {v.stock} uds</span>
                            <button type="button" onClick={() => iniciarEdicion(valores.variantes.indexOf(v))} className="text-blue-500 hover:text-blue-700">Editar</button>
                            <button type="button" onClick={() => eliminarVariante(valores.variantes.indexOf(v))} className="text-red-500 hover:text-red-700"><RiDeleteBinLine /></button>
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-4 gap-2 mt-2 bg-neutral-100 p-2 rounded">
                    <Input placeholder="Talla" value={nuevaVariante.talla} onChange={e => setNuevaVariante({...nuevaVariante, talla: e.target.value})} />
                    <Input placeholder="Color" value={nuevaVariante.color} onChange={e => setNuevaVariante({...nuevaVariante, color: e.target.value})} />
                    <Input placeholder="Precio (opc.)" type="number" value={nuevaVariante.precio} onChange={e => setNuevaVariante({...nuevaVariante, precio: e.target.value})} />
                    <Input placeholder="Stock" type="number" value={nuevaVariante.stock} onChange={e => setNuevaVariante({...nuevaVariante, stock: e.target.value})} />
                </div>
                <Boton type="button" onClick={agregarVariante} className="mt-2 text-xs">
                    {indiceEdicion !== null ? 'Actualizar variante' : 'Agregar variante'}
                </Boton>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input label="URL de imagen" name="imagenUrl" value={valores.imagenUrl} onChange={manejarCambio} placeholder="https://..." />
                <div className="flex items-center justify-end">
                    <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                        <input type="checkbox" name="destacado" checked={valores.destacado} onChange={manejarCambio} className="rounded" />
                        Marcar como destacado
                    </label>
                </div>
            </div>
            
            <textarea
                name="descripcion"
                value={valores.descripcion}
                onChange={manejarCambio}
                placeholder="Descripción..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none placeholder-neutral-400"
            />
            
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
        console.log('Guardando datos:', datos);
        if (modalForm.datos) {
            await actualizar(modalForm.datos.id, datos)
            exito('Producto actualizado')
        } else {
            await crear(datos)
            exito('Producto creado')
        }
        modalForm.cerrar()
        await recargar()
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
