// Utilidades para manejo de autenticación y tokens

/**
 * Obtiene el token de autenticación del localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

/**
 * Almacena el token de autenticación en localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token)
  }
}

/**
 * Elimina el token de autenticación del localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
  }
}

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken()
  if (!token) return false
  
  // Verificar si el token no ha expirado
  return !isTokenExpired(token)
}

/**
 * Decodifica un token JWT (sin verificar la firma)
 */
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Verifica si el token ha expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return true
    
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}

/**
 * Obtiene los headers de autorización para las requests
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken()
  if (token && !isTokenExpired(token)) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }
  return {
    'Content-Type': 'application/json',
  }
}
