import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { obtenerResumenGeneral } from '../services/reporte.service.js'
import { obtenerProductosStockBajo } from '../services/inventario.service.js'

const AlertasContext = createContext(null)

const INTERVALO_MS = 60000

export const AlertasProvider = ({ children }) => {
    const [alertas, setAlertas] = useState({
        pedidosPendientes: 0,
        stockBajo: 0,
        stockAgotado: 0,
        cargando: true,
    })

    const refrescar = useCallback(async () => {
        try {
            const [resumen, stockBajoItems] = await Promise.all([
                obtenerResumenGeneral(),
                obtenerProductosStockBajo(),
            ])

            const agotados = stockBajoItems?.filter((v) => v.stock === 0).length ?? 0
            const bajos = stockBajoItems?.filter((v) => v.stock > 0).length ?? 0

            setAlertas({
                pedidosPendientes: resumen?.pedidos?.pendientes ?? 0,
                stockBajo: bajos,
                stockAgotado: agotados,
                cargando: false,
            })
        } catch {
            setAlertas((prev) => ({ ...prev, cargando: false }))
        }
    }, [])

    useEffect(() => {
        refrescar()
        const intervalo = setInterval(refrescar, INTERVALO_MS)
        return () => clearInterval(intervalo)
    }, [refrescar])

    return (
        <AlertasContext.Provider value={{ alertas, refrescar }}>
            {children}
        </AlertasContext.Provider>
    )
}

export const useAlertas = () => {
    const ctx = useContext(AlertasContext)
    if (!ctx) throw new Error('useAlertas debe usarse dentro de AlertasProvider')
    return ctx
}