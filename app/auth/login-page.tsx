import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { setAuthToken, isAuthenticated } from '../utils/auth'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'admin',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verificar si ya está autenticado al cargar la página
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/companies', { replace: true })
    }
    
    // Mostrar mensaje si viene de una redirección
    if (location.state?.message) {
      setError(location.state.message)
    }
  }, [navigate, location.state])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Limpiar error al escribir
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error en la autenticación' }))
        throw new Error(errorData.message || 'Error en la autenticación')
      }

      const data = await response.json()
      
      // Almacenar el token en localStorage usando la utilidad
      if (data.token) {
        setAuthToken(data.token)
        console.log('Login exitoso, token almacenado')
        
        // Redirigir a la lista de empresas después del login exitoso
        navigate('/companies')
      } else {
        throw new Error('No se recibió token del servidor')
      }
    } catch (error) {
      console.error('Error en login:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido en el login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="card shadow-lg border-0">
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="bi bi-shield-lock display-4 text-primary"></i>
            <h4 className="mt-3 mb-1">Iniciar Sesión</h4>
            <p className="text-muted small">Introduce tus credenciales</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                <i className="bi bi-person me-1"></i>
                Nombre de Usuario
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Tu nombre de usuario"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                <i className="bi bi-lock me-1"></i>
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Tu contraseña"
                required
              />
            </div>

            <div className="d-grid mb-3">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginPage
