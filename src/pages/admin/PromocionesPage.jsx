import { useState, useEffect } from 'react'
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiSearchLine, RiCouponLine } from 'react-icons/ri'
import { usePromociones, useMutacionPromocion } from '../../hooks/usePromociones.js'
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
import { formatearMoneda, formatearFecha } from '../../utils/formato.js'

const validarPromocion = ({ nombre, tipoDescuento, valorDescuento, inicioEn, finEn }) => {
    const errores = {}
    if (!nombre?.trim()) errores.nombre = 'El nombre es requerido'
    if (!tipoDescuento) errores.tipoDescuento = 'El tipo es requerido'
    if (!valorDescuento || valorDescuento <= 0) errores.valorDescuento = 'El valor debe ser mayor a 0'
    if (!inicioEn) errores.inicioEn = 'La fecha de inicio es requerida'
    if (!finEn) errores.finEn = 'La fecha de fin es requerida'
    return errores
}

const VALORES_INICIALES = {
    nombre: '',
    descripcion: '',
    codigo: '',
    tipoDescuento: 'PORCENTAJE',
    valorDescuento: '',
    montoMinimo: '',
    usoMaximo: '',
    inicioEn: '',
    finEn: '',
    activo: true
}

const FormPromocion = ({ inicial, onGuardar, cargando, error }) => {
    const { valores, errores, manejarCambio, establecerValores, manejarEnvio } =
        useFormulario(VALORES_INICIALES, validarPromocion)

    useEffect(() => {
        if (inicial) {
            establecerValores({
                nombre: inicial.nombre || '',
                descripcion: inicial.descripcion || '',
                codigo: inicial.codigo || '',
                tipoDescuento: inicial.tipoDescuento || 'PORCENTAJE',
                valorDescuento: inicial.valorDescuento || '',
                montoMinimo: inicial.montoMinimo || '',
                usoMaximo: inicial.usoMaximo || '',
                inicioEn: inicial.inicioEn ? new Date(inicial.inicioEn).toISOString().split('T')[0] : '',
                finEn: inicial.finEn ? new Date(inicial.finEn).toISOString().split('T')[0] : '',
                activo: inicial.activo ?? true,
            })
        }
    }, [inicial])

    const manejarSubmit = async (e) => {
        e.preventDefault()
        await manejarEnvio(async (datos) => {
            await onGuardar({
                ...datos,
                valorDescuento: parseFloat(datos.valorDescuento),
                montoMinimo: datos.montoMinimo ? parseFloat(datos.montoMinimo) : null,
                usoMaximo: datos.usoMaximo ? parseInt(datos.usoMaximo) : null,
            })
        })
    }

    return (
        <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
            {error && <Alerta tipo="error" mensaje={error} />}
            <div className="grid grid-cols-2 gap-4">
                <Input label="Nombre" name="nombre" value={valores.nombre} onChange={manejarCambio} error={errores.nombre} requerido />
                <Input label="Código (Opcional)" name="codigo" value={valores.codigo} onChange={manejarCambio} placeholder="EJ: VERANO2026" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Tipo de descuento"
                    name="tipoDescuento"
                    value={valores.tipoDescuento}
                    onChange={manejarCambio}
                    opciones={[
                        { valor: 'PORCENTAJE', etiqueta: 'Porcentaje (%)' },
                        { valor: 'MONTO_FIJO', etiqueta: 'Monto Fijo (S/)' }
                    ]}
                />
                <Input
                    label={valores.tipoDescuento === 'PORCENTAJE' ? 'Porcentaje' : 'Monto'}
                    type="number"
                    name="valorDescuento"
                    value={valores.valorDescuento}
                    onChange={manejarCambio}
                    error={errores.valorDescuento}
                    requerido
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input label="Fecha Inicio" type="date" name="inicioEn" value={valores.inicioEn} onChange={manejarCambio} error={errores.inicioEn} requerido />
                <Input label="Fecha Fin" type="date" name="finEn" value={valores.finEn} onChange={manejarCambio} error={errores.finEn} requerido />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input label="Monto Mínimo Compra" type="number" name="montoMinimo" value={valores.montoMinimo} onChange={manejarCambio} />
                <Input label="Límite de usos" type="number" name="usoMaximo" value={valores.usoMaximo} onChange={manejarCambio} />
            </div>
            <textarea
                name="descripcion"
                value={valores.descripcion}
                onChange={manejarCambio}
                placeholder="Descripción de la promoción..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            />
            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                <input type="checkbox" name="activo" checked={valores.activo} onChange={manejarCambio} className="rounded" />
                Promoción activa
            </label>
            <div className="flex justify-end pt-2">
                <Boton type="submit" variante="primario" cargando={cargando}>
                    {inicial ? 'Guardar cambios' : 'Crear promoción'}
                </Boton>
            </div>
        </form>
    )
}

const PromocionesPage = () => {
    const { exito } = useToast()
    const modalForm = useModal('admin_promocion_form')
    const modalEliminar = useModal('admin_promocion_eliminar')
    const { termino, terminoRetrasado, manejarCambio: manejarBusqueda } = useBusqueda()
    const { datos, meta, cargando, aplicarFiltros, irAPagina, recargar } = usePromociones()
    const { crear, actualizar, eliminar, cargando: mutando, error } = useMutacionPromocion()

    useEffect(() => {
        aplicarFiltros({ busqueda: terminoRetrasado || undefined })
    }, [terminoRetrasado])

    const manejarGuardar = async (datos) => {
        if (modalForm.datos) {
            await actualizar(modalForm.datos.id, datos)
            exito('Promoción actualizada')
        } else {
            await crear(datos)
            exito('Promoción creada')
        }
        modalForm.cerrar()
        recargar()
    }

    const manejarEliminar = async () => {
        await eliminar(modalEliminar.datos.id)
        exito('Promoción eliminada')
        modalEliminar.cerrar()
        recargar()
    }

    const promociones = datos ?? []

    const columnas = [
        {
            clave: 'nombre', titulo: 'Promoción',
            render: (p) => (
                <div>
                    <p className="font-medium text-neutral-900">{p.nombre}</p>
                    {p.codigo && <span className="text-[10px] font-bold text-[#c4956a] uppercase tracking-wider bg-[#c4956a]/10 px-1.5 py-0.5 rounded">{p.codigo}</span>}
                </div>
            )
        },
        {
            clave: 'descuento', titulo: 'Descuento',
            render: (p) => p.tipoDescuento === 'PORCENTAJE' ? `${p.valorDescuento}%` : formatearMoneda(p.valorDescuento)
        },
        {
            clave: 'vigencia', titulo: 'Vigencia',
            render: (p) => (
                <div className="text-xs">
                    <p>{formatearFecha(p.inicioEn)}</p>
                    <p className="text-neutral-400">al {formatearFecha(p.finEn)}</p>
                </div>
            )
        },
        {
            clave: 'uso', titulo: 'Usos',
            render: (p) => <span className="text-xs">{p.usoActual} / {p.usoMaximo || '∞'}</span>
        },
        {
            clave: 'activo', titulo: 'Estado',
            render: (p) => {
                const ahora = new Date()
                const fin = new Date(p.finEn)
                const expirada = ahora > fin
                if (expirada) return <Badge variante="error">Expirada</Badge>
                return <Badge variante={p.activo ? 'exito' : 'advertencia'}>{p.activo ? 'Activa' : 'Pausada'}</Badge>
            }
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
            )
        }
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <CabeceraSeccion
                titulo="Promociones"
                descripcion="Gestiona cupones y descuentos automáticos"
                accion={
                    <Boton variante="primario" icono={<RiAddLine size={16} />} onClick={() => modalForm.abrir(null)}>
                        Nueva promoción
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
                            placeholder="Buscar promociones o códigos..."
                            icono={<RiSearchLine size={15} />}
                        />
                    </div>
                </div>

                <TablaBase columnas={columnas} filas={promociones} cargando={cargando} />

                {meta && meta.totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-neutral-100">
                        <Paginacion meta={meta} onCambiarPagina={irAPagina} />
                    </div>
                )}
            </div>

            <Modal
                abierto={modalForm.abierto}
                onCerrar={modalForm.cerrar}
                titulo={modalForm.datos ? 'Editar promoción' : 'Nueva promoción'}
                tamanio="md"
            >
                <FormPromocion
                    inicial={modalForm.datos}
                    onGuardar={manejarGuardar}
                    cargando={mutando}
                    error={error}
                />
            </Modal>

            <ConfirmDialog
                abierto={modalEliminar.abierto}
                titulo="Eliminar promoción"
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

export default PromocionesPage