import { apiFetch } from './api'

export async function sendRequest({ title, artist, message }) {
  // TODO: connecter à POST /api/requests
  // return await apiFetch('/api/requests', {
  //   method: 'POST',
  //   body: JSON.stringify({ title, artist, message }),
  // })

  return { success: true }
}
