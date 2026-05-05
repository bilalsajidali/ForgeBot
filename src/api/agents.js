import { api } from './index'
import { env } from '../config/env'

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

export async function uploadKnowledgeDocuments(id, files) {
  const formData = new FormData()
  for (const file of files) {
    formData.append('files', file)
  }
  const res = await api.post(`/agents/${id}/knowledge/documents`, formData)
  const hdr = res.headers
  const warnings =
    hdr[env.headers.knowledgeWarnings] ||
    hdr[env.headers.pdfWarningsLegacy] ||
    ''
  return { agent: res.data, warnings }
}

export async function deleteKnowledgeDocument(id, docIndex) {
  const { data } = await api.delete(`/agents/${id}/knowledge/documents/${docIndex}`)
  return data
}
