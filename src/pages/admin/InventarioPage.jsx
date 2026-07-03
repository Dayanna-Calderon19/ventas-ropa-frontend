import { useEffect } from 'react'
import { RiSearchLine, RiAlertLine, RiEditLine } from 'react-icons/ri'
import { useVariantes, useMutacionInventario } from '../../hooks/useInventario.js'
import { useFormulario } from '../../hooks/useFormulario.js'
import { useModal } from '../../hooks/useModal.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { useBusqueda } from '../../hooks/useBusqueda.js'
import { CabeceraSeccion } from '../../components/admin/CabeceraSeccion.jsx'
import { TablaBase } from '../../components/admin/TablaBase.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Alerta } from '../../components/ui/Alerta.jsx'
import { Paginacion } from '../../components/ui/Paginacion.jsx'

const validarAjuste = ({ tipo, cantidad }) => {
    const errores = {}
    if (!tipo) errores.tipo = 'El tipo es requerido'
    if (!cantidad || isNaN(cantidad) || Number(cantidad) < 1) errores.cantidad = 'La cantidad debe ser mayor a 0'
    return errores
}

const FormAjuste = ({ variante, onGuardar, cargando, error }) => {
    const { valores, errores, manejarCambio, manejarEnvio } = useFormulario(
        { tipo: 'ENTRADA', cantidad: '', motivo: '' },
        validarAjuste
    )

    const manejarSubmit = async (e) => {
        e.preventDefault()
        await manejarEnvio(async (datos) => {
            await onGuardar({ tipo: datos.tipo, cantidad: parseInt(datos.cantidad, 10), motivo: datos.motivo || undefined })
        })
    }

    return (
        <form onSubmit={manejarSubmit} className="flex flex-col gap-4" noValidate>
            {error && <Alerta tipo="error" mensaje={error} />}
            <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                <p className="font-medium text-neutral-900">{variante?.producto?.nombre}</p>
                <p className="text-neutral-500">{variante?.talla} · {variante?.color} · SKU: {variante?.sku}</p>
                <p className="text-neutral-700 font-semibold mt-1">Stock actual: {variante?.stock} unidades</p>
            </div>
            <Select
                label="Tipo de movimiento"
                name="tipo"
                value={valores.tipo}
                onChange={manejarCambio}
                error={errores.tipo}
                opciones={[
                    { valor: 'ENTRADA', etiqueta: 'Entrada (agregar stock)' },
                    { valor: 'SALIDA', etiqueta: 'Salida (reducir stock)' },
                ]}
                requerido
            />
            <Input label="Cantidad" type="number" name="cantidad" value={valores.cantidad} onChange={manejarCambio} error={errores.cantidad} placeholder="0" requerido />
            <Input label="Motivo (opcional)" name="motivo" value={valores.motivo} onChange={manejarCambio} placeholder="Ej: Compra a proveedor, ajuste manual..." />
            <div className="flex justify-end pt-2">
                <Boton type="submit" variante="primario" cargando={cargando}>Aplicar ajuste</Boton>
            </div>
        </form>
    )
}

const InventarioPage = () => {
    const { exito } = useToast()
    const modalAjuste = useModal('admin_inventario_ajuste')
    const { termino, terminoRetrasado, manejarCambio: manejarBusqueda } = useBusqueda()
    const { datos, meta, cargando, filtros, aplicarFiltros, irAPagina, recargar } = useVariantes()
    const { ajustar, cargando: ajustando, error } = useMutacionInventario()

    useEffect(() => {
        aplicarFiltros({ busqueda: terminoRetrasado || undefined })
    }, [terminoRetrasado])

    const manejarAjuste = async (payload) => {
        await ajustar(modalAjuste.datos.id, payload)
        exito('Stock ajustado correctamente')
        modalAjuste.cerrar()
        recargar()
    }

    const columnas = [
        {
            clave: 'producto', titulo: 'Producto',
            render: (v) => (
                <div>
                    <p className="font-medium text-neutral-900">{v.producto?.nombre}</p>
                    <p className="text-xs text-neutral-400">SKU: {v.sku}</p>
                </div>
            ),
        },
        { clave: 'talla', titulo: 'Talla', render: (v) => <span className="text-sm">{v.talla}</span> },
        { clave: 'color', titulo: 'Color', render: (v) => <span className="text-sm">{v.color}</span> },
        {
            clave: 'stock', titulo: 'Stock',
            render: (v) => (
                <div className="flex items-center gap-2">
                    <span className={`font-semibold ${v.stock === 0 ? 'text-red-600' : v.stock <= 5 ? 'text-orange-600' : 'text-neutral-900'}`}>{v.stock}</span>
                    {v.stock === 0 && <Badge variante="error">Agotado</Badge>}
                    {v.stock > 0 && v.stock <= 5 && <Badge variante="alerta">Stock bajo</Badge>}
                </div>
            ),
        },
        { clave: 'activo', titulo: 'Estado', render: (v) => <Badge variante={v.activo ? 'exito' : 'error'}>{v.activo ? 'Activo' : 'Inactivo'}</Badge> },
        {
            clave: 'acciones', titulo: 'Acciones',
            render: (v) => (
                <button onClick={(e) => { e.stopPropagation(); modalAjuste.abrir(v) }} className="flex items-center gap-1 px-2.5 py-1.5 text-xs border border-neutral-300 rounded hover:border-neutral-900 transition-colors text-neutral-700">
                    <RiEditLine size={13} /> Ajustar
                </button>
            ),
        },
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <CabeceraSeccion titulo="Inventario" descripcion="Control de stock por variante" />
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-3 border-b border-neutral-100">
                    <div className="flex-1 w-full">
                        <Input type="text" value={termino} onChange={manejarBusqueda} placeholder="Buscar por producto, SKU..." icono={<RiSearchLine size={15} />} />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer whitespace-nowrap">
                        <input type="checkbox" checked={filtros.stockBajo === 'true'} onChange={(e) => aplicarFiltros({ stockBajo: e.target.checked ? 'true' : undefined })} className="rounded" />
                        <RiAlertLine size={15} className="text-orange-500" />
                        Solo stock bajo
                    </label>
                </div>
                <TablaBase columnas={columnas} filas={datos ?? []} cargando={cargando} />
                {meta && meta.totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-neutral-100">
                        <Paginacion meta={meta} onCambiarPagina={irAPagina} />
                    </div>
                )}
            </div>
            <Modal abierto={modalAjuste.abierto} onCerrar={modalAjuste.cerrar} titulo="Ajustar stock" tamanio="sm">
                <FormAjuste variante={modalAjuste.datos} onGuardar={manejarAjuste} cargando={ajustando} error={error} />
            </Modal>
        </div>
    )
}

export default InventarioPage