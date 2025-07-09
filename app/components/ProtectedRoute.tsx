import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { isAuthenticated, isTokenExpired, getAuthToken, removeAuthToken } from '../utils/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        navigate('/auth/login')
        return
      }

      const token = getAuthToken()
      if (token && isTokenExpired(token)) {
        removeAuthToken()
        navigate('/auth/login')
        return
      }
    }

    checkAuth()
  }, [navigate])

  // Si no está autenticado, no renderizar nada mientras redirige
  if (!isAuthenticated()) {
    return null
  }

  const token = getAuthToken()
  if (token && isTokenExpired(token)) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
