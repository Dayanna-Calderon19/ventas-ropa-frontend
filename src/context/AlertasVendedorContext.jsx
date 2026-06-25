import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { obtenerProductosStockBajo } from '../services/inventario.service.js'

const AlertasVendedorContext = createContext(null)

const INTERVALO_MS = 60000

export const AlertasVendedorProvider = ({ children }) => {
    const [alertas, setAlertas] = useState({
        stockBajo: 0,
        stockAgotado: 0,
        cargando: true,
    })

    const refrescar = useCallback(async () => {
        try {
            const items = await obtenerProductosStockBajo()
            const agotados = items?.filter((v) => v.stock === 0).length ?? 0
            const bajos = items?.filter((v) => v.stock > 0).length ?? 0

            setAlertas({ stockBajo: bajos, stockAgotado: agotados, cargando: false })
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
        <AlertasVendedorContext.Provider value={{ alertas, refrescar }}>
            {children}
        </AlertasVendedorContext.Provider>
    )
}

export const useAlertasVendedor = () => {
    const ctx = useContext(AlertasVendedorContext)
    if (!ctx) throw new Error('useAlertasVendedor debe usarse dentro de AlertasVendedorProvider')
    return ctx
}