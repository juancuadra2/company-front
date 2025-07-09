import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import { removeAuthToken, getAuthToken, decodeToken } from '../utils/auth'

const CompanyLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    removeAuthToken()
    navigate('/auth/login')
  }

  // Obtener información del usuario del token
  const getUserInfo = () => {
    const token = getAuthToken()
    if (token) {
      const decoded = decodeToken(token)
      return decoded?.username || 'Usuario'
    }
    return 'Usuario'
  }

  return (
    <>
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
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {getUserInfo()}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="min-vh-100">
        <Outlet />
      </main>

      <footer className="bg-light py-3 mt-5">
        <div className="container text-center">
          <small className="text-muted">
            © 2025 Sistema de Gestión de Empresas
          </small>
        </div>
      </footer>
    </>
  )
}

export default CompanyLayout
