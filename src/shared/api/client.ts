import axios from 'axios'
import { API_URL } from '../config/env'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Do not hard-redirect — public pages must stay accessible without auth.
      // The router guard handles redirects for protected routes.
    }
    return Promise.reject(error)
  },
)
