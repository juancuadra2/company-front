import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { removeAuthToken, getAuthToken, isAuthenticated, isTokenExpired } from '../utils/auth'

const CompanyLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  // Verificación de autenticación
  useEffect(() => {
    const checkAuth = () => {
      // Verificar si el usuario está autenticado
      if (!isAuthenticated()) {
        console.log('Usuario no autenticado, redirigiendo al login')
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

  const handleLogout = () => {
    removeAuthToken()
    navigate('/auth/login')
  }

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

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-building me-2"></i>
            Gestión de Empresas
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/companies' ? 'active' : ''}`}
                  to="/companies"
                >
                  <i className="bi bi-list-ul me-1"></i>
                  Lista de Empresas
                </Link>
              </li>
            </ul>
            
            <ul className="navbar-nav">
              <li className="nav-item">
                <button 
                  className="btn btn-outline-light"
                  type="button"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <footer className="bg-light py-3 mt-auto">
        <div className="container text-center">
          <small className="text-muted">
            © 2025 Sistema de Gestión de Empresas
          </small>
        </div>
      </footer>
    </div>
  )
}

export default CompanyLayout
