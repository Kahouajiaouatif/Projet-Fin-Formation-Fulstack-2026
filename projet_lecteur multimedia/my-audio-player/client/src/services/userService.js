import { apiFetch } from './api'

export async function updateProfil({ username, email }) {
  // TODO: connecter à PATCH /api/users/me
  // return await apiFetch('/api/users/me', {
  //   method: 'PATCH',
  //   body: JSON.stringify({ username, email }),
  // })

  return { username, email }
}

export async function changePassword({ currentPwd, newPwd }) {
  // TODO: connecter à PATCH /api/users/me/password
  // return await apiFetch('/api/users/me/password', {
  //   method: 'PATCH',
  //   body: JSON.stringify({ currentPwd, newPwd }),
  // })
}

export async function deleteAccount() {
  // TODO: connecter à DELETE /api/users/me
  // return await apiFetch('/api/users/me', { method: 'DELETE' })
}
