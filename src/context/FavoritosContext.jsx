import { createContext, useState, useEffect, useCallback } from 'react'

export const FavoritosContext = createContext(null)

export const FavoritosProvider = ({ children }) => {
    const [favoritos, setFavoritos] = useState(() => {
        const guardado = localStorage.getItem('favoritos')
        return guardado ? JSON.parse(guardado) : []
    })

    useEffect(() => {
        localStorage.setItem('favoritos', JSON.stringify(favoritos))
    }, [favoritos])

    const estaEnFavoritos = useCallback(
        (productoId) => favoritos.some((f) => f.id === productoId),
        [favoritos]
    )

    const alternarFavorito = useCallback((producto) => {
        setFavoritos((actuales) => {
            const existe = actuales.some((f) => f.id === producto.id)
            if (existe) {
                return actuales.filter((f) => f.id !== producto.id)
            }
            return [...actuales, producto]
        })
    }, [])

    const quitarFavorito = useCallback((productoId) => {
        setFavoritos((actuales) => actuales.filter((f) => f.id !== productoId))
    }, [])

    return (
        <FavoritosContext.Provider
            value={{
                favoritos,
                cantidadFavoritos: favoritos.length,
                estaEnFavoritos,
                alternarFavorito,
                quitarFavorito,
            }}
        >
            {children}
        </FavoritosContext.Provider>
    )
}
