import { createContext, useState, useCallback, useEffect } from 'react'
import { iniciarSesion, registrarse, cerrarSesion, obtenerPerfil } from '../services/auth.service.js'
import { obtenerUsuario, haySesionActiva } from '../utils/almacenamiento.js'
import { extraerMensajeError } from '../utils/manejarError.js'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(() => obtenerUsuario())
    const [cargandoSesion, setCargandoSesion] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const verificarSesion = async () => {
            if (!haySesionActiva()) {
                setCargandoSesion(false)
                return
            }
            try {
                const perfil = await obtenerPerfil()
                setUsuario(perfil)
            } catch {
                setUsuario(null)
            } finally {
                setCargandoSesion(false)
            }
        }
        verificarSesion()
    }, [])

    const login = useCallback(async (credenciales) => {
        setError(null)
        try {
            const resultado = await iniciarSesion(credenciales)
            setUsuario(resultado.usuario)
            return resultado
        } catch (err) {
            setError(extraerMensajeError(err))
            throw err
        }
    }, [])

    const registro = useCallback(async (datos) => {
        setError(null)
        try {
            const resultado = await registrarse(datos)
            setUsuario(resultado.usuario)
            return resultado
        } catch (err) {
            setError(extraerMensajeError(err))
            throw err
        }
    }, [])

    const logout = useCallback(() => {
        cerrarSesion()
        setUsuario(null)
        setError(null)
    }, [])

    const esAdmin = usuario?.rol === 'ADMIN'
    const esVendedor = usuario?.rol === 'VENDEDOR'
    const esCliente = usuario?.rol === 'CLIENTE'
    const estaAutenticado = !!usuario

    const tieneRol = useCallback((...roles) => {
        if (!usuario) return false
        return roles.includes(usuario.rol)
    }, [usuario])

    return (
        <AuthContext.Provider
            value={{
                usuario,
                cargandoSesion,
                error,
                estaAutenticado,
                esAdmin,
                esVendedor,
                esCliente,
                login,
                registro,
                logout,
                tieneRol,
                setUsuario,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}