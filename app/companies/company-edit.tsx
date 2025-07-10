import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import DeleteCompanyButton from './components/DeleteCompanyButton'
import ToastContainer from '../components/ToastContainer'
import { useToast } from '../hooks/useToast'

// Tipos para la empresa
interface Company {
  id: number
  name: string
  nit: string
  address: string | null
  phone: string | null
}

const CompanyEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toasts, showSuccess, showError, hideToast } = useToast()

  // Estados
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Cargar empresa al montar el componente
  useEffect(() => {
    if (id) {
      fetchCompany()
    }
  }, [id])

  // Función para obtener empresa del backend
  const fetchCompany = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8080/companies/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Empresa no encontrada')
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setCompany(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la empresa')
    } finally {
      setLoading(false)
    }
  }

  // Función para mostrar toast
  const showToastMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      showSuccess(message, 7000) // Más tiempo para mensajes de éxito
    } else {
      showError(message)
    }
  }

  // Función para actualizar empresa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company) return

    try {
      setIsSaving(true)

      const token = localStorage.getItem('authToken')
      const dataToUpdate = {
        name: company.name,
        nit: company.nit,
        address: company.address && company.address.trim() !== '' ? company.address : null,
        phone: company.phone && company.phone.trim() !== '' ? company.phone : null
      }

      const response = await fetch(`http://localhost:8080/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(dataToUpdate)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }

      setIsEditing(false)
      showToastMessage('Empresa actualizada exitosamente', 'success')
      
      // Recargar los datos actualizados
      await fetchCompany()
    } catch (error: any) {
      let errorMessage = 'Error al actualizar la empresa'
      
      try {
        const errorData = JSON.parse(error.message)
        errorMessage = errorData.message || errorMessage
        
        if (errorData.details && typeof errorData.details === 'object') {
          const fieldErrors = Object.entries(errorData.details)
            .map(([field, message]) => `• ${field}: ${message}`)
            .join('\n')
          
          if (fieldErrors) {
            errorMessage += '\n\nDetalles:\n' + fieldErrors
          }
        }
      } catch {
        errorMessage = error.message || errorMessage
      }
      
      showToastMessage(errorMessage, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCompany(prev => prev ? ({
      ...prev,
      [name]: value
    }) : null)
  }

  // Función para manejar eliminación exitosa
  const handleDeleteSuccess = () => {
    showToastMessage(`La empresa "${company?.name}" ha sido eliminada exitosamente.\n\nRedirigiendo a la lista...`, 'success')
    
    // Redirigir a la lista después de 3 segundos para que el usuario vea el mensaje
    setTimeout(() => {
      navigate('/companies')
    }, 3000)
  }

  // Función para manejar error en eliminación
  const handleDeleteError = (errorMessage: string) => {
    showToastMessage(errorMessage, 'error')
  }

  // Estados de la carga y manejo de errores
  if (loading) {
    return (
      <div className="d-flex flex-column">
        <div className="container mt-4 flex-grow-1">
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="d-flex flex-column">
        <div className="container mt-4 flex-grow-1">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
          <Link to="/companies" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i>
            Volver a la lista
          </Link>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="d-flex flex-column">
        <div className="container mt-4 flex-grow-1">
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <i className="bi bi-info-circle me-2"></i>
            <div>No se encontró la empresa solicitada.</div>
          </div>
          <Link to="/companies" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i>
            Volver a la lista
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column">
      <div className="container mt-4 flex-grow-1">
      {/* Toast Container */}
      <ToastContainer 
        toasts={toasts} 
        onHideToast={hideToast} 
        position="top-right" 
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Empresa: {company.name}</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/companies">Empresas</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Editar Empresa
              </li>
            </ol>
          </nav>
        </div>
        <div>
          {!isEditing ? (
            <button 
              className="btn btn-primary me-2"
              onClick={() => setIsEditing(true)}
              disabled={isSaving}
            >
              <i className="bi bi-pencil me-1"></i>
              Editar
            </button>
          ) : (
            <button 
              className="btn btn-secondary me-2"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              <i className="bi bi-x-circle me-1"></i>
              Cancelar
            </button>
          )}
          <Link to="/companies" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i>
            Volver
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Información de la Empresa</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={company.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="nit" className="form-label">NIT *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nit"
                      name="nit"
                      value={company.nit}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={company.phone || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="address" className="form-label">Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={company.address || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-1"></i>
                          Guardar Cambios
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-danger"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Cancelar
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Acciones</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <DeleteCompanyButton
                  company={company}
                  onDeleteSuccess={handleDeleteSuccess}
                  onDeleteError={handleDeleteError}
                  disabled={isEditing || isSaving}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default CompanyEdit
