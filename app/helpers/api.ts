// API helpers para manejo de requests y configuración
import { getAuthHeaders, removeAuthToken } from '../utils/auth'

// Base URL de la API
export const API_BASE_URL = 'http://localhost:8080'

// Tipos para respuestas de API
export interface ApiError {
  message: string
  code?: string
  details?: any
}

// Helper para procesar respuestas de la API
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`
    
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
    } catch {
      // Si no se puede parsear el JSON, usar el mensaje por defecto
    }
    
    throw new Error(errorMessage)
  }
  
  return response.json()
}

// Helper para hacer requests autenticados con manejo de errores
export const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        }
    })
    
    // Si la respuesta es 401, el token probablemente expiró
    if (response.status === 401) {
        removeAuthToken()
        // Opcional: redirigir al login
        if (typeof window !== 'undefined') {
            window.location.href = '/auth/login'
        }
    }
    
    return response
}

// Funciones de conveniencia para métodos HTTP comunes
export const apiGet = async <T>(endpoint: string): Promise<T> => {
  const response = await apiRequest(endpoint, { method: 'GET' })
  return handleApiResponse<T>(response)
}

export const apiPost = async <T>(endpoint: string, data?: any): Promise<T> => {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  })
  return handleApiResponse<T>(response)
}

export const apiPut = async <T>(endpoint: string, data?: any): Promise<T> => {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  })
  return handleApiResponse<T>(response)
}

export const apiDelete = async <T>(endpoint: string): Promise<T> => {
  const response = await apiRequest(endpoint, { method: 'DELETE' })
  return handleApiResponse<T>(response)
}
