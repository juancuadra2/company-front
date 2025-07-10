import { useState, useEffect } from 'react'

interface CompanyFormData {
  name: string
  nit: string
  address: string | null
  phone: string | null
}

interface CompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (company: CompanyFormData) => Promise<void>
  title?: string
  submitButtonText?: string
  initialData?: Partial<CompanyFormData>
}

const CompanyModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Nueva Empresa",
  submitButtonText = "Guardar",
  initialData = {}
}: CompanyModalProps) => {
  const [companyData, setCompanyData] = useState({
    name: initialData.name || '',
    nit: initialData.nit || '',
    address: initialData.address || '',
    phone: initialData.phone || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)

  // Auto-ocultar el toast después de 5 segundos
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)
      setError(null)
      setShowToast(false)

      // Preparar los datos, enviando null para campos opcionales vacíos
      const dataToSubmit: CompanyFormData = {
        name: companyData.name,
        nit: companyData.nit,
        address: companyData.address && companyData.address.trim() !== '' ? companyData.address : null,
        phone: companyData.phone && companyData.phone.trim() !== '' ? companyData.phone : null
      }

      await onSubmit(dataToSubmit)

      // Limpiar el formulario después del envío exitoso
      setCompanyData({ name: '', nit: '', address: '', phone: '' })
      onClose()
    } catch (error: any) {
      // Extraer mensaje de error del backend
      let errorMessage = 'Error al procesar la solicitud'

      if (error instanceof Error) {
        // Intentar parsear el mensaje como JSON para errores de API
        try {
          const errorData = JSON.parse(error.message)
          errorMessage = errorData.message || 'Error al procesar la solicitud'

          // Si hay detalles específicos por campo, agregarlos
          if (errorData.details && typeof errorData.details === 'object') {
            const fieldErrors = Object.entries(errorData.details)
              .map(([field, message]) => `• ${field}: ${message}`)
              .join('\n')

            if (fieldErrors) {
              errorMessage += '\n\nDetalles:\n' + fieldErrors
            }
          }
        } catch {
          // Si no es JSON válido, usar el mensaje del error tal como está
          errorMessage = error.message
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      }

      setError(errorMessage)
      setShowToast(true)
      console.error('Error submitting company:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setCompanyData({ name: '', nit: '', address: '', phone: '' })
      setError(null)
      setShowToast(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={isSubmitting}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre *</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={companyData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="nit" className="form-label">NIT *</label>
                <input
                  type="text"
                  className="form-control"
                  id="nit"
                  name="nit"
                  value={companyData.nit}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={companyData.address || ''}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={companyData.phone || ''}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-1"></i>
                    {submitButtonText}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast de error */}
      {showToast && error && (
        <div
          className="toast-container position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1055 }}
        >
          <div className="toast show" role="alert" style={{ minWidth: '350px' }}>
            <div className="toast-header bg-danger text-white">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <strong className="me-auto">Error de Validación</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => {
                  setShowToast(false)
                  setError(null)
                }}
              ></button>
            </div>
            <div className="toast-body">
              <div style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                {error}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyModal
