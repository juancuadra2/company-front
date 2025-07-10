import { useEffect } from 'react'

export interface ToastProps {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
  autoHide?: boolean
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  showIcon?: boolean
}

const Toast = ({ 
  show, 
  message, 
  type, 
  onClose, 
  autoHide = true, 
  duration = 5000,
  position = 'top-right',
  showIcon = true
}: ToastProps) => {
  
  // Auto-ocultar el toast después del tiempo especificado
  useEffect(() => {
    if (show && autoHide) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, autoHide, duration, onClose])

  if (!show) return null

  // Configurar estilos según el tipo
  const getToastClasses = () => {
    const baseClasses = 'toast show position-fixed m-3'
    const positionClasses = {
      'top-right': 'top-0 end-0',
      'top-left': 'top-0 start-0',
      'bottom-right': 'bottom-0 end-0',
      'bottom-left': 'bottom-0 start-0',
      'top-center': 'top-0 start-50 translate-middle-x',
      'bottom-center': 'bottom-0 start-50 translate-middle-x'
    }
    
    return `${baseClasses} ${positionClasses[position]}`
  }

  const getHeaderClasses = () => {
    const typeClasses = {
      success: 'bg-success text-white',
      error: 'bg-danger text-white',
      warning: 'bg-warning text-dark',
      info: 'bg-info text-white'
    }
    return `toast-header ${typeClasses[type]}`
  }

  const getIcon = () => {
    if (!showIcon) return null
    
    const icons = {
      success: 'bi-check-circle',
      error: 'bi-exclamation-triangle',
      warning: 'bi-exclamation-triangle',
      info: 'bi-info-circle'
    }
    
    return <i className={`bi ${icons[type]} me-2`}></i>
  }

  const getTitle = () => {
    const titles = {
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información'
    }
    return titles[type]
  }

  const getCloseButtonClasses = () => {
    return type === 'warning' ? 'btn-close' : 'btn-close btn-close-white'
  }

  return (
    <div 
      className={getToastClasses()}
      role="alert" 
      aria-live="assertive" 
      aria-atomic="true"
      style={{ zIndex: 1050, whiteSpace: 'pre-line', minWidth: '300px' }}
    >
      <div className={getHeaderClasses()}>
        {getIcon()}
        <strong className="me-auto">{getTitle()}</strong>
        <button 
          type="button" 
          className={getCloseButtonClasses()}
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  )
}

export default Toast
