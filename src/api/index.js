import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { env } from '../config/env'

export const api = axios.create({
  baseURL: env.apiBaseUrl,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    if (status === 401) {
      useAuthStore.getState().logout()
      if (typeof window !== 'undefined') {
        const path = window.location.pathname
        const isPublic =
          path === '/' ||
          path.startsWith('/login') ||
          path.startsWith('/signup')
        if (!isPublic) {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)
