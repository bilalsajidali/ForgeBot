import { api } from './index'

export async function sendTestMessage(botId, message, sessionHistory) {
  const { data } = await api.post(`/chat/test/${botId}`, {
    message,
    session_history: sessionHistory,
  })
  return data
}
