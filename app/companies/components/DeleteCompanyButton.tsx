import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { deleteCompany } from '../../store/slices/company/thunk'

interface Company {
  id: number
  name: string
}

interface DeleteCompanyButtonProps {
  company: Company
  onDeleteSuccess?: () => void
  onDeleteError?: (error: string) => void
  variant?: 'outline' | 'solid'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
  disabled?: boolean
}

const DeleteCompanyButton = ({ 
  company, 
  onDeleteSuccess, 
  onDeleteError,
  variant = 'outline',
  size = 'md',
  showIcon = true,
  className = '',
  disabled = false
}: DeleteCompanyButtonProps) => {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector(state => state.company)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = async () => {
    try {
      await dispatch(deleteCompany(company.id))
      onDeleteSuccess?.()
      setShowDeleteConfirm(false)
    } catch (error: any) {
      let errorMessage = 'Error al eliminar la empresa'
      
      if (error) {
        try {
          const errorData = JSON.parse(error)
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = error
        }
      }
      
      onDeleteError?.(errorMessage)
      setShowDeleteConfirm(false)
    }
  }

  // Clases del botón según variante y tamaño
  const getButtonClasses = () => {
    const baseClass = 'btn'
    const variantClass = variant === 'outline' ? 'btn-outline-danger' : 'btn-danger'
    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''
    
    return `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim()
  }

  return (
    <>
      <button 
        className={getButtonClasses()}
        onClick={() => setShowDeleteConfirm(true)}
        disabled={disabled || isLoading}
        title="Eliminar empresa"
      >
        {showIcon && <i className="bi bi-trash me-1"></i>}
        Eliminar
      </button>

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                ></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar la empresa <strong>{company.name}</strong>?</p>
                <p className="text-muted">Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash me-1"></i>
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeleteCompanyButton
