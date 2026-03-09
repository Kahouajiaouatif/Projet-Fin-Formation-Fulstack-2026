const BASE_URL = 'http://localhost:5000'

export function getStreamUrl() {
  return `${BASE_URL}/stream`
}

export async function getHistory() {
  // TODO: connecter à GET /api/history
  // const res = await fetch(`${BASE_URL}/api/history`, {
  //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  // })
  // return await res.json()

  return []
}
