import { Link } from 'react-router'

const CompaniesList = () => {
  // Mock data para mostrar ejemplo
  const companies = [
    { id: 1, name: 'Empresa A', email: 'contacto@empresa-a.com', phone: '+34 123 456 789' },
    { id: 2, name: 'Empresa B', email: 'info@empresa-b.com', phone: '+34 987 654 321' },
    { id: 3, name: 'Empresa C', email: 'hello@empresa-c.com', phone: '+34 555 666 777' },
  ]

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Empresas</h2>
        <button className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Nueva Empresa
        </button>
      </div>

      <div className="row">
        {companies.map((company) => (
          <div key={company.id} className="col-md-6 col-lg-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{company.name}</h5>
                <p className="card-text">
                  <i className="bi bi-envelope me-2"></i>
                  {company.email}
                </p>
                <p className="card-text">
                  <i className="bi bi-telephone me-2"></i>
                  {company.phone}
                </p>
              </div>
              <div className="card-footer">
                <Link 
                  to={`/companies/${company.id}/edit`} 
                  className="btn btn-outline-primary btn-sm"
                >
                  <i className="bi bi-pencil me-1"></i>
                  Editar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {companies.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-building display-1 text-muted"></i>
          <h4 className="text-muted mt-3">No hay empresas registradas</h4>
          <p className="text-muted">Comienza agregando tu primera empresa</p>
        </div>
      )}
    </div>
  )
}

export default CompaniesList
