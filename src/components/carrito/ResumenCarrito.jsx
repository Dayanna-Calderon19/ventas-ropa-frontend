import { useState } from 'react'
import { RiCouponLine, RiCloseLine } from 'react-icons/ri'
import { formatearMoneda } from '../../utils/formato.js'
import { Input } from '../ui/Input.jsx'
import { Boton } from '../ui/Boton.jsx'

export const ResumenCarrito = ({ subtotal, descuento = 0, costoEnvio = 0, className = '', promocion, promosVigentes = [], onAplicarPromo = () => {}, onQuitarPromo = () => {} }) => {
    const [codigoPromo, setCodigoPromo] = useState('')
    const impuesto = parseFloat(((subtotal - descuento + costoEnvio) * 0.18).toFixed(2))
    const total = parseFloat((subtotal - descuento + costoEnvio + impuesto).toFixed(2))

    const filas = [
        { etiqueta: 'Subtotal', valor: subtotal },
        descuento > 0 && { etiqueta: `Descuento ${promocion ? `(${promocion.nombre})` : ''}`, valor: -descuento, clase: 'text-green-600' },
        costoEnvio > 0 && { etiqueta: 'Envío', valor: costoEnvio },
        { etiqueta: 'IGV (18%)', valor: impuesto, clase: 'text-neutral-500 text-xs' },
    ].filter(Boolean)

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {/* Sección de Promociones */}
            <div className="mb-2">
                <p className="text-xs font-semibold text-neutral-900 mb-2">Promoción</p>
                {promocion ? (
                    <div className="flex items-center justify-between bg-green-50 text-green-700 text-xs p-2 rounded border border-green-200">
                        <span>{promocion.nombre} ({promocion.codigo})</span>
                        <button onClick={onQuitarPromo}><RiCloseLine /></button>
                    </div>
                ) : (
                    <>
                        <div className="flex gap-2 mb-2">
                            <Input placeholder="Código" className="text-xs" value={codigoPromo} onChange={(e) => setCodigoPromo(e.target.value)} />
                            <Boton variante="secundario" className="text-xs" onClick={() => onAplicarPromo(codigoPromo)}>Aplicar</Boton>
                        </div>
                        {promosVigentes.length > 0 && (
                            <div className="max-h-24 overflow-y-auto border border-neutral-100 rounded p-1 bg-neutral-50">
                                {promosVigentes.map(promo => {
                                    const cumpleMonto = !promo.montoMinimo || subtotal >= promo.montoMinimo;
                                    return (
                                        <button 
                                            key={promo.id}
                                            onClick={() => onAplicarPromo(promo)}
                                            disabled={!cumpleMonto}
                                            className={`w-full text-left text-xs p-1 rounded ${cumpleMonto ? 'hover:bg-neutral-100' : 'opacity-50 cursor-not-allowed'}`}
                                        >
                                            <RiCouponLine className="inline mr-1 text-neutral-400" />
                                            {promo.codigo} {!cumpleMonto && <span className="text-red-500 text-[10px] ml-1">(Min: {promo.montoMinimo})</span>}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {filas.map((fila) => (
                <div key={fila.etiqueta} className="flex justify-between text-sm">
                    <span className={`text-neutral-500 ${fila.clase ?? ''}`}>{fila.etiqueta}</span>
                    <span className={`font-medium ${fila.clase ?? 'text-neutral-900'}`}>
                        {fila.valor < 0 ? `-${formatearMoneda(Math.abs(fila.valor))}` : formatearMoneda(fila.valor)}
                    </span>
                </div>
            ))}
            <div className="flex justify-between text-base font-bold pt-3 border-t border-neutral-200">
                <span>Total</span>
                <span>{formatearMoneda(total)}</span>
            </div>
        </div>
    )
}
