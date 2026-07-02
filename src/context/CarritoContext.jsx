import { createContext, useReducer, useCallback, useMemo, useEffect } from 'react'

export const CarritoContext = createContext(null)

const ACCIONES = {
    AGREGAR: 'AGREGAR',
    QUITAR: 'QUITAR',
    CAMBIAR_CANTIDAD: 'CAMBIAR_CANTIDAD',
    LIMPIAR: 'LIMPIAR',
    APLICAR_PROMOCION: 'APLICAR_PROMOCION',
    QUITAR_PROMOCION: 'QUITAR_PROMOCION',
    CARGAR_ESTADO: 'CARGAR_ESTADO',
}

const reducerCarrito = (estado, accion) => {
    switch (accion.type) {
        case ACCIONES.CARGAR_ESTADO:
            return accion.payload;

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
            return { items: [], promocion: null }

        case ACCIONES.APLICAR_PROMOCION:
            return { ...estado, promocion: accion.payload }

        case ACCIONES.QUITAR_PROMOCION:
            return { ...estado, promocion: null }

        default:
            return estado
    }
}

const estadoInicial = { items: [], promocion: null }

export const CarritoProvider = ({ children }) => {
    // Cargar estado inicial desde localStorage
    const [estado, dispatch] = useReducer(reducerCarrito, estadoInicial, (inicial) => {
        const guardado = localStorage.getItem('carrito');
        return guardado ? JSON.parse(guardado) : inicial;
    })

    // Guardar en localStorage cada vez que el estado cambie
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(estado));
    }, [estado]);

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

    const aplicarPromocion = useCallback((promocion) => {
        dispatch({ type: ACCIONES.APLICAR_PROMOCION, payload: promocion })
    }, [])

    const quitarPromocion = useCallback(() => {
        dispatch({ type: ACCIONES.QUITAR_PROMOCION })
    }, [])

    const estaEnCarrito = useCallback(
        (varianteId) => estado.items.some((i) => i.varianteId === varianteId),
        [estado.items]
    )

    const totales = useMemo(() => {
        const subtotal = estado.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
        const cantidadItems = estado.items.reduce((acc, i) => acc + i.cantidad, 0)
        
        let descuento = 0
        if (estado.promocion) {
            // Validar que la promoción siga siendo aplicable (ej. monto mínimo)
            if (!estado.promocion.montoMinimo || subtotal >= estado.promocion.montoMinimo) {
                if (estado.promocion.tipoDescuento === 'PORCENTAJE') {
                    descuento = (subtotal * estado.promocion.valorDescuento) / 100
                } else {
                    descuento = Math.min(estado.promocion.valorDescuento, subtotal)
                }
            }
        }
        
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            descuento: parseFloat(descuento.toFixed(2)),
            promocion: estado.promocion,
            cantidadItems,
            cantidadLineas: estado.items.length,
        }
    }, [estado.items, estado.promocion])

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
                aplicarPromocion,
                quitarPromocion,
                estaEnCarrito,
            }}
        >
            {children}
        </CarritoContext.Provider>
    )
}