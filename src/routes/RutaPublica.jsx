import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { CargandoPagina } from '../components/ui/Spinner.jsx'

const REDIRECCION_POR_ROL = {
    ADMIN: '/admin',
    VENDEDOR: '/vendedor',
    CLIENTE: '/',
}

export const RutaPublica = ({ children }) => {
    const { estaAutenticado, cargandoSesion, usuario } = useAuth()

    if (cargandoSesion) return <CargandoPagina />

    if (estaAutenticado) {
        const destino = REDIRECCION_POR_ROL[usuario?.rol] ?? '/'
        return <Navigate to={destino} replace />
    }

    return children
}