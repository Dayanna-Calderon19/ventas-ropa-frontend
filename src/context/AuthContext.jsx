import { createContext, useState, useCallback, useEffect } from 'react'
import { limpiarSesion, obtenerUsuario, haySesionActiva, guardarToken, guardarUsuario } from '../utils/almacenamiento.js'
import { iniciarSesion, registrarse, obtenerPerfil } from '../services/auth.service.js'
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
                guardarUsuario(perfil)
            } catch {
                limpiarSesion()
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
            // The API returns { ok, message, data: { usuario, token } }
            const { usuario, token } = resultado.data

            guardarToken(token)
            guardarUsuario(usuario)
            setUsuario(usuario)

            return resultado
        } catch (err) {
            setError(extraerMensajeError(err))
            throw err
        }
    }, [])
// ... rest of the file
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
        limpiarSesion()
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
