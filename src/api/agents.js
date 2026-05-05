import { api } from './index'

export async function listAgents() {
  const { data } = await api.get('/agents/list')
  return data
}

export async function getAgent(id) {
  const { data } = await api.get(`/agents/${id}`)
  return data
}

export async function createAgent(payload) {
  const { data } = await api.post('/agents/create', payload)
  return data
}

export async function updateAgent(id, payload) {
  const { data } = await api.put(`/agents/${id}`, payload)
  return data
}

export async function deleteAgent(id) {
  await api.delete(`/agents/${id}`)
}
