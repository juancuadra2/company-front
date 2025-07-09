import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { isAuthenticated, isTokenExpired, getAuthToken, removeAuthToken } from '../utils/auth'

const ProtectedLayout = () => {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      // Verificar si el usuario está autenticado
      if (!isAuthenticated()) {
        console.log('Usuario no autenticado, redirigiendo al login')
        // Mostrar un toast o notificación aquí si es necesario
        navigate('/auth/login', { 
          replace: true,
          state: { message: 'Debes iniciar sesión para acceder a esta página' }
        })
        return false
      }

      // Verificar si el token ha expirado
      const token = getAuthToken()
      if (token && isTokenExpired(token)) {
        console.log('Token expirado, limpiando y redirigiendo al login')
        removeAuthToken()
        navigate('/auth/login', { 
          replace: true,
          state: { message: 'Tu sesión ha expirado, por favor inicia sesión nuevamente' }
        })
        return false
      }

      return true
    }

    const isValid = checkAuth()
    setIsChecking(false)
    
    if (!isValid) return

    // Verificar autenticación cada minuto
    const interval = setInterval(() => {
      checkAuth()
    }, 60000)
    
    return () => clearInterval(interval)
  }, [navigate])

  // Mostrar loading mientras verifica autenticación
  if (isChecking || !isAuthenticated()) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Verificando autenticación...</span>
          </div>
          <h5 className="text-muted">Verificando autenticación...</h5>
          <p className="text-muted small">Espera un momento mientras verificamos tu sesión</p>
        </div>
      </div>
    )
  }

  // Verificar expiración del token
  const token = getAuthToken()
  if (token && isTokenExpired(token)) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-warning mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Sesión expirada...</span>
          </div>
          <h5 className="text-warning">Sesión expirada</h5>
          <p className="text-muted">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  // Si está autenticado y el token es válido, mostrar el contenido
  return <Outlet />
}

export default ProtectedLayout
