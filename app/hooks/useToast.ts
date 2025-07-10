import { useState, useCallback } from 'react'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration?: number) => {
    const id = Date.now().toString()
    const newToast: ToastMessage = {
      id,
      message,
      type,
      duration
    }
    
    setToasts(prev => [...prev, newToast])
    
    return id
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Funciones de conveniencia
  const showSuccess = useCallback((message: string, duration?: number) => 
    showToast(message, 'success', duration), [showToast])
  
  const showError = useCallback((message: string, duration?: number) => 
    showToast(message, 'error', duration), [showToast])
  
  const showWarning = useCallback((message: string, duration?: number) => 
    showToast(message, 'warning', duration), [showToast])
  
  const showInfo = useCallback((message: string, duration?: number) => 
    showToast(message, 'info', duration), [showToast])

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
