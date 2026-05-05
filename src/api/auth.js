import { api } from './index'

export async function signup(name, email, password) {
  const { data } = await api.post('/auth/signup', { name, email, password })
  return data
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}
