import Toast from './Toast'
import type { ToastMessage } from '../hooks/useToast'

interface ToastContainerProps {
  toasts: ToastMessage[]
  onHideToast: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

const ToastContainer = ({ toasts, onHideToast, position = 'top-right' }: ToastContainerProps) => {
  if (toasts.length === 0) return null

  const getContainerStyle = () => {
    const styles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 1050,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      margin: '1rem',
      maxWidth: '400px'
    }

    switch (position) {
      case 'top-right':
        return { ...styles, top: 0, right: 0 }
      case 'top-left':
        return { ...styles, top: 0, left: 0 }
      case 'bottom-right':
        return { ...styles, bottom: 0, right: 0 }
      case 'bottom-left':
        return { ...styles, bottom: 0, left: 0 }
      case 'top-center':
        return { ...styles, top: 0, left: '50%', transform: 'translateX(-50%)' }
      case 'bottom-center':
        return { ...styles, bottom: 0, left: '50%', transform: 'translateX(-50%)' }
      default:
        return { ...styles, top: 0, right: 0 }
    }
  }

  return (
    <div style={getContainerStyle()}>
      {toasts.map((toast) => (
        <div key={toast.id} style={{ position: 'relative', margin: 0 }}>
          <Toast
            show={true}
            message={toast.message}
            type={toast.type}
            onClose={() => onHideToast(toast.id)}
            duration={toast.duration}
            position={position}
          />
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
