import api from './api.js'

/**
 * Envía una nueva reclamación (público, sin token)
 */
export const crearReclamacion = async (datos) => {
    const respuesta = await api.post('/reclamaciones', datos)
    return respuesta.data
}

/**
 * Lista todas las reclamaciones (solo admin)
 */
export const listarReclamaciones = async (params = {}) => {
    const respuesta = await api.get('/reclamaciones', { params })
    return respuesta.data
}

/**
 * Estadísticas de reclamaciones (solo admin)
 */
export const estadisticasReclamaciones = async () => {
    const respuesta = await api.get('/reclamaciones/stats')
    return respuesta.data
}
