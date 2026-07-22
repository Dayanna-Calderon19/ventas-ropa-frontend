import { useState, useEffect } from 'react'
import { RiBarChartLine, RiMoneyDollarCircleLine, RiShoppingCartLine, RiStackLine, RiDownload2Line } from 'react-icons/ri'
import { useReportes } from '../../hooks/useReportes.js'
import { CabeceraSeccion } from '../../components/admin/CabeceraSeccion.jsx'
import { TarjetaResumen } from '../../components/admin/TarjetaResumen.jsx'
import { Boton } from '../../components/ui/Boton.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { formatearMoneda } from '../../utils/formato.js'

const ReportesPage = () => {
    const { resumen, ventasPeriodo, productosMasVendidos, ingresosMensuales, inventario, cargando } = useReportes()

    if (cargando) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <CabeceraSeccion
                titulo="Reportes y Análisis"
                descripcion="Visualiza el rendimiento de tu negocio"
                accion={
                    <Boton variante="secundario" icono={<RiDownload2Line size={16} />} onClick={() => window.print()}>
                        Exportar PDF
                    </Boton>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <TarjetaResumen
                    titulo="Total Ventas"
                    valor={resumen?.totalVentas || 0}
                    subtitulo="Ventas registradas"
                    Icono={RiShoppingCartLine}
                    color="azul"
                />
                <TarjetaResumen
                    titulo="Ingresos Totales"
                    valor={formatearMoneda(resumen?.ingresosTotales || 0)}
                    subtitulo="Acumulado histórico"
                    Icono={RiMoneyDollarCircleLine}
                    color="exito"
                />
                <TarjetaResumen
                    titulo="Ticket Promedio"
                    valor={formatearMoneda(resumen?.ticketPromedio || 0)}
                    subtitulo="Por cada venta"
                    Icono={RiBarChartLine}
                    color="tierra"
                />
                <TarjetaResumen
                    titulo="Total Productos"
                    valor={resumen?.totalProductos || 0}
                    subtitulo="En catálogo"
                    Icono={RiStackLine}
                    color="info"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-neutral-200 rounded-lg shadow-sm">
                    <h3 className="text-sm font-bold text-neutral-900 mb-4 uppercase tracking-wider">Productos más vendidos</h3>
                    <div className="space-y-4">
                        {productosMasVendidos?.map((p, i) => (
                            <div key={p.id} className="flex items-center gap-4">
                                <span className="text-sm font-bold text-neutral-400 w-4">{i + 1}.</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-800">{p.nombre}</p>
                                    <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-1">
                                        <div
                                            className="bg-[#b8933f] h-full rounded-full"
                                            style={{ width: `${(p.cantidad / (productosMasVendidos[0].cantidad || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-neutral-900">{p.cantidad} uds</span>
                            </div>
                        ))}
                        {(!productosMasVendidos || productosMasVendidos.length === 0) && (
                            <p className="text-sm text-neutral-400 italic">No hay datos suficientes</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 border border-neutral-200 rounded-lg shadow-sm">
                    <h3 className="text-sm font-bold text-neutral-900 mb-4 uppercase tracking-wider">Estado de Inventario</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                            <p className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Stock Bajo</p>
                            <p className="text-2xl font-bold text-red-600">{inventario?.stockBajo || 0}</p>
                            <p className="text-xs text-red-500 mt-1">Variantes con &lt; 5 uds</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <p className="text-[10px] uppercase font-bold text-green-400 tracking-wider">Saludable</p>
                            <p className="text-2xl font-bold text-green-600">{inventario?.stockSaludable || 0}</p>
                            <p className="text-xs text-green-500 mt-1">Variantes con stock</p>
                        </div>
                        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Valor Total</p>
                            <p className="text-xl font-bold text-neutral-900">{formatearMoneda(inventario?.valorInventario || 0)}</p>
                            <p className="text-xs text-neutral-500 mt-1">Precio base estimado</p>
                        </div>
                        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Total Unidades</p>
                            <p className="text-xl font-bold text-neutral-900">{inventario?.totalUnidades || 0}</p>
                            <p className="text-xs text-neutral-500 mt-1">En todas las variantes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportesPage
