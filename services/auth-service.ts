import axios from "axios"

const API_URL = "http://localhost:5000/api/auth"

export const login = async (email: string, password: string) => {
  return axios.post(`${API_URL}/login`, { email, password })
}

export const register = async (name: string, email: string, password: string) => {
  return axios.post(`${API_URL}/register`, { name, email, password })
}

export const resetPassword = async (email: string) => {
  return axios.post(`${API_URL}/reset-password`, { email })
}

// Funções auxiliares para gerenciamento de token
export const getAuthToken = (): string | null => {
  // Tenta obter o token do localStorage primeiro
  const token = localStorage.getItem("authToken")

  // Se não encontrar no localStorage, tenta no sessionStorage
  if (!token) {
    return sessionStorage.getItem("authToken")
  }

  return token
}

export const setAuthToken = (token: string, rememberMe: boolean): void => {
  if (rememberMe) {
    localStorage.setItem("authToken", token)
  } else {
    sessionStorage.setItem("authToken", token)
  }
}

export const removeAuthToken = (): void => {
  localStorage.removeItem("authToken")
  sessionStorage.removeItem("authToken")
}
