import { Link } from 'react-router'
import DeleteCompanyButton from './DeleteCompanyButton'
import { type CompaniesViewProps } from '../types'

interface CompaniesTableViewProps extends CompaniesViewProps {}

const CompaniesTableView = ({ 
  companies, 
  onDeleteSuccess, 
  onDeleteError 
}: CompaniesTableViewProps) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">NIT</th>
            <th scope="col">Dirección</th>
            <th scope="col">Teléfono</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td className="fw-medium">{company.name}</td>
              <td>{company.nit}</td>
              <td>{company.address || <span className="text-muted">Sin dirección</span>}</td>
              <td>{company.phone || <span className="text-muted">Sin teléfono</span>}</td>
              <td>
                <div className="d-flex gap-1">
                  <Link 
                    to={`/companies/${company.id}/edit`} 
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Editar
                  </Link>
                  <DeleteCompanyButton
                    company={{ id: company.id, name: company.name }}
                    onDeleteSuccess={onDeleteSuccess}
                    onDeleteError={onDeleteError}
                    variant="outline"
                    size="sm"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CompaniesTableView
