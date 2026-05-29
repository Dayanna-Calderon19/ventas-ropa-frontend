import { createContext, useReducer, useCallback, useMemo } from 'react'

export const CarritoContext = createContext(null)

const ACCIONES = {
    AGREGAR: 'AGREGAR',
    QUITAR: 'QUITAR',
    CAMBIAR_CANTIDAD: 'CAMBIAR_CANTIDAD',
    LIMPIAR: 'LIMPIAR',
}

const reducerCarrito = (estado, accion) => {
    switch (accion.type) {
        case ACCIONES.AGREGAR: {
            const { variante, cantidad = 1 } = accion.payload
            const existente = estado.items.find((i) => i.varianteId === variante.id)

            if (existente) {
                return {
                    ...estado,
                    items: estado.items.map((i) =>
                        i.varianteId === variante.id
                            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, variante.stock) }
                            : i
                    ),
                }
            }

            return {
                ...estado,
                items: [
                    ...estado.items,
                    {
                        varianteId: variante.id,
                        sku: variante.sku,
                        talla: variante.talla,
                        color: variante.color,
                        precio: variante.precio,
                        stock: variante.stock,
                        nombreProducto: variante.producto?.nombre || '',
                        imagenUrl: variante.producto?.imagenUrl || null,
                        cantidad,
                    },
                ],
            }
        }

        case ACCIONES.QUITAR:
            return {
                ...estado,
                items: estado.items.filter((i) => i.varianteId !== accion.payload.varianteId),
            }

        case ACCIONES.CAMBIAR_CANTIDAD: {
            const { varianteId, cantidad } = accion.payload
            if (cantidad <= 0) {
                return {
                    ...estado,
                    items: estado.items.filter((i) => i.varianteId !== varianteId),
                }
            }
            return {
                ...estado,
                items: estado.items.map((i) =>
                    i.varianteId === varianteId
                        ? { ...i, cantidad: Math.min(cantidad, i.stock) }
                        : i
                ),
            }
        }

        case ACCIONES.LIMPIAR:
            return { items: [] }

        default:
            return estado
    }
}

const estadoInicial = { items: [] }

export const CarritoProvider = ({ children }) => {
    const [estado, dispatch] = useReducer(reducerCarrito, estadoInicial)

    const agregarItem = useCallback((variante, cantidad = 1) => {
        dispatch({ type: ACCIONES.AGREGAR, payload: { variante, cantidad } })
    }, [])

    const quitarItem = useCallback((varianteId) => {
        dispatch({ type: ACCIONES.QUITAR, payload: { varianteId } })
    }, [])

    const cambiarCantidad = useCallback((varianteId, cantidad) => {
        dispatch({ type: ACCIONES.CAMBIAR_CANTIDAD, payload: { varianteId, cantidad } })
    }, [])

    const limpiarCarrito = useCallback(() => {
        dispatch({ type: ACCIONES.LIMPIAR })
    }, [])

    const estaEnCarrito = useCallback(
        (varianteId) => estado.items.some((i) => i.varianteId === varianteId),
        [estado.items]
    )

    const totales = useMemo(() => {
        const subtotal = estado.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
        const cantidadItems = estado.items.reduce((acc, i) => acc + i.cantidad, 0)
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            cantidadItems,
            cantidadLineas: estado.items.length,
        }
    }, [estado.items])

    const itemsParaPedido = useMemo(
        () => estado.items.map((i) => ({ varianteId: i.varianteId, cantidad: i.cantidad })),
        [estado.items]
    )

    return (
        <CarritoContext.Provider
            value={{
                items: estado.items,
                ...totales,
                itemsParaPedido,
                agregarItem,
                quitarItem,
                cambiarCantidad,
                limpiarCarrito,
                estaEnCarrito,
            }}
        >
            {children}
        </CarritoContext.Provider>
    )
}