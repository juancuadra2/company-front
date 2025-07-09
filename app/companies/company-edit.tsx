import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router'

const CompanyEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Mock data - en una aplicación real esto vendría de una API
  const [company, setCompany] = useState({
    id: id,
    name: `Empresa ${id}`,
    email: `contacto@empresa-${id}.com`,
    phone: '+34 123 456 789',
    address: 'Calle Principal 123',
    city: 'Madrid',
    zipCode: '28001',
    description: 'Descripción de la empresa...'
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando empresa:', company)
    setIsEditing(false)
    // navigate('/companies') // Opcional: redirigir después de guardar
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompany(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Empresa #{id}</h2>
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
            >
              <i className="bi bi-pencil me-1"></i>
              Editar
            </button>
          ) : (
            <button 
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
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
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={company.email}
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
                      value={company.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="zipCode" className="form-label">Código Postal</label>
                    <input
                      type="text"
                      className="form-control"
                      id="zipCode"
                      name="zipCode"
                      value={company.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-8">
                    <label htmlFor="address" className="form-label">Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={company.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="city" className="form-label">Ciudad</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={company.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows={4}
                    value={company.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Guardar Cambios
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-danger"
                      onClick={() => setIsEditing(false)}
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
                <button className="btn btn-outline-primary">
                  <i className="bi bi-eye me-1"></i>
                  Ver Detalles
                </button>
                <button className="btn btn-outline-warning">
                  <i className="bi bi-clock-history me-1"></i>
                  Historial
                </button>
                <button className="btn btn-outline-danger">
                  <i className="bi bi-trash me-1"></i>
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h6 className="card-title mb-0">Información</h6>
            </div>
            <div className="card-body">
              <small className="text-muted">
                <div className="mb-2">
                  <strong>Creado:</strong><br />
                  15 de junio, 2024
                </div>
                <div>
                  <strong>Última modificación:</strong><br />
                  2 de julio, 2025
                </div>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyEdit
