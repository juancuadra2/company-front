import { Link } from 'react-router'
import { useState, useEffect } from 'react'
import CompanyModal from './components/CompanyModal'
import DeleteCompanyButton from './components/DeleteCompanyButton'
import ToastContainer from '../components/ToastContainer'
import { useToast } from '../hooks/useToast'

// Tipos para la respuesta del API
interface Company {
  id: number
  name: string
  nit: string
  address: string
  phone: string
}

interface ApiResponse {
  data: Company[]
  totalPages: number
  totalElements: number
  pageSize: number
  currentPage: number
}

const CompaniesList = () => {
  const { toasts, showSuccess, showError, hideToast } = useToast()
  
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Estados para filtrado y vista
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  
  // Estados para paginación del backend
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // Función para obtener las empresas del backend
  const fetchCompanies = async (search?: string, page?: number, size?: number) => {
    try {
      setLoading(true)
      setError(null)
      
      // Usar los valores actuales del estado si no se proporcionan parámetros
      const searchParam = search !== undefined ? search : searchTerm
      const pageParam = page !== undefined ? page : currentPage
      const sizeParam = size !== undefined ? size : pageSize
      
      // Construir URL con query parameters
      const params = new URLSearchParams({
        search: searchParam,
        page: pageParam.toString(),
        size: sizeParam.toString()
      })
      
      // Obtener el token del localStorage
      const token = localStorage.getItem('authToken')
      
      const response = await fetch(`http://localhost:8080/companies?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data: ApiResponse = await response.json()
      setCompanies(data.data)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
      setCurrentPage(data.currentPage)
      setPageSize(data.pageSize)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las empresas')
    } finally {
      setLoading(false)
    }
  }

  // Cargar empresas al montar el componente
  useEffect(() => {
    fetchCompanies()
  }, [])

  // Efecto para buscar cuando cambia el término de búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== undefined) {
        setCurrentPage(0) // Resetear a la primera página al buscar
        fetchCompanies(searchTerm, 0, pageSize)
      }
    }, 500) // Debounce de 500ms

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Función para manejar cambio de página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    fetchCompanies(searchTerm, newPage, pageSize)
  }

  // Función para manejar cambio de tamaño de página
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(0)
    fetchCompanies(searchTerm, 0, newSize)
  }

  // Función para recargar sin parámetros
  const handleRetry = () => {
    fetchCompanies()
  }

  // Función para agregar nueva empresa
  const handleAddCompany = async (companyData: { name: string; nit: string; address: string | null; phone: string | null }) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken')
    
    const response = await fetch('http://localhost:8080/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(companyData)
    })
    
    if (!response.ok) {
      // Parsear el error del backend
      let errorMessage = `Error ${response.status}: ${response.statusText}`
      
      try {
        const errorData = await response.json()
        // Crear un error que incluya toda la información del backend
        const fullError = new Error(JSON.stringify(errorData))
        throw fullError
      } catch (parseError) {
        // Si no se puede parsear el JSON, usar el mensaje básico
        throw new Error(errorMessage)
      }
    }
    
    // Mostrar toast de éxito
    showSuccess(`Empresa "${companyData.name}" creada exitosamente`, 5000)
    
    // Recargar la lista de empresas
    await fetchCompanies()
  }

  // Función para manejar el cierre del modal
  const handleCloseModal = () => {
    setShowAddModal(false)
  }

  // Función para manejar eliminación exitosa
  const handleDeleteSuccess = () => {
    showSuccess('Empresa eliminada exitosamente', 4000)
    // Recargar la lista de empresas
    fetchCompanies()
  }

  // Función para manejar error en eliminación
  const handleDeleteError = (errorMessage: string) => {
    showError(`Error al eliminar empresa: ${errorMessage}`)
  }

  return (
    <div className="container mt-4">
      {/* Toast Container */}
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

      {/* Controles de filtrado y vista */}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="btn-group w-100" role="group">
            <button
              type="button"
              className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewMode('cards')}
            >
              <i className="bi bi-grid-3x3-gap"></i>
            </button>
            <button
              type="button"
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewMode('table')}
            >
              <i className="bi bi-table"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      {!loading && !error && (
        <div className="mb-3">
          <small className="text-muted">
            Mostrando {companies.length} de {totalElements} empresas
            {searchTerm && ` para "${searchTerm}"`}
            {totalPages > 1 && ` - Página ${currentPage + 1} de ${totalPages}`}
          </small>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando empresas...</p>
        </div>
      )}

      {/* Error state */}
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

      {/* Companies display */}
      {!loading && !error && (
        <>
          {viewMode === 'cards' ? (
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
                          onDeleteSuccess={handleDeleteSuccess}
                          onDeleteError={handleDeleteError}
                          variant="outline"
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
                            onDeleteSuccess={handleDeleteSuccess}
                            onDeleteError={handleDeleteError}
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
          )}
        </>
      )}

      {/* Empty state */}
      {!loading && !error && totalElements === 0 && !searchTerm && (
        <div className="text-center py-5">
          <i className="bi bi-building display-1 text-muted"></i>
          <h4 className="text-muted mt-3">No hay empresas registradas</h4>
          <p className="text-muted">Comienza agregando tu primera empresa</p>
        </div>
      )}

      {/* No results found */}
      {!loading && !error && totalElements === 0 && searchTerm && (
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

      {/* Paginación */}
      {!loading && !error && totalPages > 1 && (
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
              
              {/* Páginas numeradas */}
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

      {/* Modal para agregar nueva empresa */}
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
