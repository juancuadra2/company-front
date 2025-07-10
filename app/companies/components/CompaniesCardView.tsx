import { Link } from 'react-router'
import DeleteCompanyButton from './DeleteCompanyButton'
import { type CompaniesViewProps } from '../types'

interface CompaniesCardViewProps extends CompaniesViewProps {}

const CompaniesCardView = ({ 
  companies, 
  onDeleteSuccess, 
  onDeleteError 
}: CompaniesCardViewProps) => {
  return (
    <div className="row">
      {companies.map((company) => (
        <div key={company.id} className="col-md-6 col-lg-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">{company.name}</h5>
              <p className="card-text">
                <i className="bi bi-card-text me-2"></i>
                NIT: {company.nit}
              </p>
              <p className="card-text">
                <i className="bi bi-geo-alt me-2"></i>
                {company.address || 'Sin dirección'}
              </p>
              <p className="card-text">
                <i className="bi bi-telephone me-2"></i>
                {company.phone || 'Sin teléfono'}
              </p>
            </div>
            <div className="card-footer">
              <div className="d-flex gap-2">
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
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CompaniesCardView
