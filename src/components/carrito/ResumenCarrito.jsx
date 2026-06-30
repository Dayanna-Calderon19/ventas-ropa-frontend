import { formatearMoneda } from '../../utils/formato.js'

export const ResumenCarrito = ({ subtotal, descuento = 0, costoEnvio = 0, className = '', promocion }) => {
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
