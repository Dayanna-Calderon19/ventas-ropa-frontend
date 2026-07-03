import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { CargandoPagina } from '../components/ui/Spinner.jsx'

export const RutaPrivada = ({ children, roles = [] }) => {
    const { estaAutenticado, cargandoSesion, usuario } = useAuth()
    const location = useLocation()

    if (cargandoSesion) return <CargandoPagina />

    if (!estaAutenticado) {
        return <Navigate to="/login" state={{ desde: location }} replace />
    }

    if (roles.length > 0 && !roles.includes(usuario?.rol)) {
        return <Navigate to="/" replace />
    }

    return children
}