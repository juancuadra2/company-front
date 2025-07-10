import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { 
  fetchCompanies, 
  createCompany, 
  type CreateCompanyData,
} from '../store/slices/company/thunk'
import { setSearchTerm, clearError } from '../store/slices/company/company-slice'
import CompanyModal from './components/CompanyModal'
import CompaniesCardView from './components/CompaniesCardView'
import CompaniesTableView from './components/CompaniesTableView'
import ViewModeToggle from './components/ViewModeToggle'
import ToastContainer from '../components/ToastContainer'
import { useToast } from '../hooks/useToast'

const CompaniesList = () => {
  const dispatch = useAppDispatch()
  const { 
    companies, 
    isLoading, 
    error, 
    currentPage, 
    totalPages, 
    totalElements, 
    pageSize, 
    searchTerm 
  } = useAppSelector(state => state.company)
  
  const { toasts, showSuccess, showError, hideToast } = useToast()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  useEffect(() => {
    dispatch(fetchCompanies({ search: searchTerm, page: currentPage, size: pageSize }))
  }, [dispatch])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        dispatch(setSearchTerm(localSearchTerm))
        dispatch(fetchCompanies({ search: localSearchTerm, page: 0, size: pageSize }))
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [localSearchTerm, dispatch, searchTerm, pageSize])

  const handlePageChange = (newPage: number) => {
    dispatch(fetchCompanies({ search: searchTerm, page: newPage, size: pageSize }))
  }

  const handlePageSizeChange = (newSize: number) => {
    dispatch(fetchCompanies({ search: searchTerm, page: 0, size: newSize }))
  }

  const handleRetry = () => {
    dispatch(fetchCompanies({ search: searchTerm, page: currentPage, size: pageSize }))
  }

  const handleAddCompany = async (companyData: CreateCompanyData) => {
    try {
      await dispatch(createCompany(companyData))
      showSuccess(`Empresa "${companyData.name}" creada exitosamente`, 5000)
      dispatch(fetchCompanies({ search: searchTerm, page: currentPage, size: pageSize }))
    } catch (error: any) {
      let errorMessage = 'Error al crear la empresa'
      if (error) {
        try {
          const errorData = JSON.parse(error)
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = error
        }
      }
      showError(errorMessage)
    }
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
  }

  const handleDeleteSuccess = () => {
    showSuccess('Empresa eliminada exitosamente', 4000)
    dispatch(fetchCompanies({ search: searchTerm, page: currentPage, size: pageSize }))
  }

  const handleDeleteError = (errorMessage: string) => {
    showError(`Error al eliminar empresa: ${errorMessage}`)
  }

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  return (
    <div className="container mt-4">
      <ToastContainer 
        toasts={toasts} 
        onHideToast={hideToast} 
        position="top-right" 
      />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Empresas</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nueva Empresa
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-9">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o NIT..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <ViewModeToggle 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>

      {!isLoading && !error && (
        <div className="mb-3">
          <small className="text-muted">
            Mostrando {companies.length} de {totalElements} empresas
            {searchTerm && ` para "${searchTerm}"`}
            {totalPages > 1 && ` - Página ${currentPage + 1} de ${totalPages}`}
          </small>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando empresas...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={handleRetry}
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {viewMode === 'cards' ? (
            <CompaniesCardView
              companies={companies}
              onDeleteSuccess={handleDeleteSuccess}
              onDeleteError={handleDeleteError}
            />
          ) : (
            <CompaniesTableView
              companies={companies}
              onDeleteSuccess={handleDeleteSuccess}
              onDeleteError={handleDeleteError}
            />
          )}
        </>
      )}

      {!isLoading && !error && totalElements === 0 && !searchTerm && (
        <div className="text-center py-5">
          <i className="bi bi-building display-1 text-muted"></i>
          <h4 className="text-muted mt-3">No hay empresas registradas</h4>
          <p className="text-muted">Comienza agregando tu primera empresa</p>
        </div>
      )}

      {!isLoading && !error && totalElements === 0 && searchTerm && (
        <div className="text-center py-5">
          <i className="bi bi-search display-1 text-muted"></i>
          <h4 className="text-muted mt-3">No se encontraron resultados</h4>
          <p className="text-muted">
            No hay empresas que coincidan con "{searchTerm}"
          </p>
          <button 
            className="btn btn-outline-primary"
            onClick={() => setSearchTerm('')}
          >
            Limpiar búsqueda
          </button>
        </div>
      )}

      {!isLoading && !error && totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="d-flex align-items-center">
            <span className="me-3">Elementos por página:</span>
            <select 
              className="form-select w-auto"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <nav aria-label="Paginación de empresas">
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Anterior
                </button>
              </li>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i;
                } else if (currentPage < 3) {
                  pageNumber = i;
                } else if (currentPage >= totalPages - 3) {
                  pageNumber = totalPages - 5 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                return (
                  <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber + 1}
                    </button>
                  </li>
                );
              })}
              <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <CompanyModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleAddCompany}
        title="Nueva Empresa"
        submitButtonText="Guardar"
      />
    </div>
  )
}

export default CompaniesList
